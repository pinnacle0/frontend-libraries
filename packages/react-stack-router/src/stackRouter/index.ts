import {Action} from "history";
import {Route, formatPath} from "../route";
import {Screen} from "../screen";
import {invariant} from "../invariant";
import {createStackHistory} from "./stackHistory";
import {createSafariEdgeSwipeDetector} from "./safariEdgeSwipeDetector";
import type React from "react";
import type {History, Update, To, Key} from "history";
import type {LocationState, Location, PushOption} from "../type";
import type {Match} from "../route";
import type {StackHistory} from "./stackHistory";
import type {TransitionType} from "../screen/transition";

export type Subscriber = (screens: Screen[]) => void;

type TransitionOption = {
    type: TransitionType;
    duration: number;
};

type InternalLocationState<S extends LocationState> = {
    $key: Key;
} & S;

export type StackRoutePattern = {
    pattern: string;
    parent: StackRoutePattern | null;
    hasComponent: boolean;
};

export type StackRoutePayload = {
    component: React.ComponentType<any>;
    pattern: StackRoutePattern;
};

export type StackRouterOptions = {
    history: History;
    transitionDuration: number;
};

export class StackRouter {
    private initialized = false;
    private screens: Screen[] = [];
    private stackHistory: StackHistory<InternalLocationState<any>>;
    private subscribers = new Set<Subscriber>();
    private route = new Route<StackRoutePayload>();
    private safariEdgeSwipeDetector = createSafariEdgeSwipeDetector();
    private transitionDuration: number;

    private pushOption = new Snapshot<PushOption>();
    private resolve = new Snapshot<() => void>();

    constructor(options: StackRouterOptions) {
        this.stackHistory = createStackHistory(options.history);
        this.transitionDuration = options.transitionDuration;
        this.stackHistory.listen(this.handler.bind(this));
    }

    async initialize() {
        if (this.initialized) return;
        this.initialized = true;

        const {pathname, hash, search} = window.location;
        const matched = this.matchRoute(pathname);

        let numOfParentComponent = 0;
        let parentPattern: StackRoutePattern | null = matched.payload.pattern.parent;
        while (parentPattern) {
            if (parentPattern.hasComponent) {
                numOfParentComponent++;
            }
            parentPattern = parentPattern.parent;
        }

        const stack: To[] = [{pathname, hash, search}];
        const segments = ["/", ...matched.matchedSegments];

        while (numOfParentComponent !== 0 && segments.length !== 0) {
            const pathname = formatPath(segments.join("/"));
            const matched = this.route.lookup(pathname);
            if (!matched?.fallback) {
                stack.unshift(pathname.startsWith("/") ? pathname : `/${pathname}`);
                numOfParentComponent--;
            }
            segments.pop();
        }

        return Promise.all(stack.map((to, index) => (index === 0 ? this.replace(to) : this.push(to, {transitionType: "exiting"}))));
    }

    updateRoute(route: Route<StackRoutePayload>) {
        this.route = route;
    }

    attachSafariEdgeSwipeDetector() {
        return this.safariEdgeSwipeDetector.attach();
    }

    subscribe(subscriber: Subscriber): () => void {
        this.subscribers.add(subscriber);
        return () => {
            this.subscribers.delete(subscriber);
        };
    }

    async push(to: To, option?: PushOption): Promise<void> {
        if (!this.matchRoute(to)) return;

        this.pushOption.value = option ?? null;
        const wait = new Promise<void>(resolve => (this.resolve.value = resolve));
        this.stackHistory.push(to, {$key: this.createKey(), ...(option?.state ?? {})});

        return wait;
    }

    async pop(times: number = 1): Promise<void> {
        if (times === 0) return;

        let wait!: Promise<void>;

        for (let i = 0; i < times; i++) {
            wait = new Promise<void>(resolve => (this.resolve.value = resolve));
            this.stackHistory.pop();
            // delay 10ms, otherwise consecutive router.pop() will not work in iOS
            if (times > 1) await delay(10);
        }

        return wait;
    }

    replace(to: To, state?: Record<string, any>): void {
        if (!this.matchRoute(to)) return;
        this.stackHistory.replace(to, {$key: (this.stackHistory.location.state as any)?.$key ?? this.createKey(), ...(state ?? {})});
    }

    replaceSearchParams<T extends Record<string, string> = Record<string, string>>(newParam: T | ((current: T) => T)): void {
        const {pathname, search, hash, state} = this.stackHistory.location;
        const nextSearchParam = typeof newParam === "function" ? newParam(new URLSearchParams(search) as any) : newParam;
        this.stackHistory.replace({pathname, search: new URLSearchParams(nextSearchParam).toString(), hash}, state);
    }

    replaceHash(hash: string): void {
        const location = this.stackHistory.location;
        this.stackHistory.replace({pathname: location.pathname, search: location.search, hash}, location.state);
    }

    replaceLocationState<T extends LocationState = LocationState>(newState: T | ((current: T) => T)): void {
        const {pathname, search, hash, state} = this.stackHistory.location;
        const $key = state?.$key;
        const nextState = typeof newState === "function" ? newState(state as T) : newState;
        this.stackHistory.replace({pathname, search, hash}, {...nextState, $key});
    }

    isSafariEdgeSwipeBackwardPop(): boolean {
        return this.safariEdgeSwipeDetector.isBackwardPop;
    }

    private createKey() {
        return Date.now().toString(36) + Math.random().toString(36).substring(2);
    }

    private notify() {
        this.subscribers.forEach(_ => _([...this.screens]));
    }

    private getTopScreen(): Screen | null {
        const top = this.screens[this.screens.length - 1];
        return top ?? null;
    }

    private matchRoute(to: To): Match<StackRoutePayload> {
        const pathname = typeof to === "string" ? to : to.pathname;
        const matched = this.route.lookup(pathname ?? window.location.pathname);

        invariant(matched, `None of the route match current pathname:${pathname}. Please make sure you have defined fallback route using "**"`);
        return matched;
    }

    private createScreen(location: Location, transitionOption: Required<TransitionOption>): Screen | null {
        const matched = this.matchRoute(location.pathname);
        if (!matched) return null;

        return new Screen({
            content: matched.payload.component,
            location,
            params: matched.params,
            searchParams: Object.fromEntries(new URLSearchParams(location.search)),
            transition: {
                type: transitionOption.type,
                duration: transitionOption.duration,
            },
        });
    }

    private pushScreen(location: Location, transition: TransitionType): void {
        const option = this.pushOption.value;
        const resolve = this.resolve.value;

        const screen = this.createScreen(location, {type: option?.transitionType ?? transition, duration: option?.transitionDuration ?? this.transitionDuration});
        if (!screen) {
            resolve?.();
            return;
        }

        resolve && screen.lifecycle.attachOnce("didEnter", resolve);
        this.screens.push(screen);
        this.notify();
    }

    private popScreen(transition: TransitionType) {
        const resolve = this.resolve.value;
        const top = this.getTopScreen();

        if (!top) {
            resolve?.();
            return;
        }

        top.transition.update(transition);
        this.screens.pop();
        top.lifecycle.attachOnce("didExit", () => resolve?.());
        this.notify();
    }

    private replaceScreen(location: Location) {
        const top = this.getTopScreen();

        top?.transition.update("none");
        this.screens.pop();

        const screen = this.createScreen(location, {type: "exiting", duration: this.transitionDuration});
        if (!screen) {
            return;
        }

        this.screens.push(screen);
        this.notify();
    }

    private handler({action, location}: Update) {
        switch (action) {
            case Action.Push:
                this.pushScreen(location as any, this.safariEdgeSwipeDetector.isForwardPop ? "none" : "both");
                break;
            case Action.Pop:
                this.popScreen(this.safariEdgeSwipeDetector.isBackwardPop ? "none" : "both");
                break;
            case Action.Replace:
                this.replaceScreen(location as any);
                break;
        }
    }
}

// Turn value to null after read
class Snapshot<T> {
    constructor(private _value: T | null = null) {}

    get value() {
        const current = this._value;
        this._value = null;
        return current;
    }

    set value(newValue: T | null) {
        this._value = newValue;
    }
}

async function delay(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
