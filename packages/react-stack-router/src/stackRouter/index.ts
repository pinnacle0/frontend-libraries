import {Action} from "history";
import {Route, formatPath} from "../route";
import {Screen} from "../screen";
import {invariant} from "../invariant";
import {createStackHistory} from "./stackHistory";
import {createSafariEdgeSwipeDetector} from "./safariEdgeSwipeDetector";
import type React from "react";
import type {History, Update, To} from "history";
import type {LocationState, Location, PushOption} from "../type";
import type {Match} from "../route";
import type {StackHistory} from "./stackHistory";
import type {TransitionType} from "../screen/transition";

export type Subscriber = (screens: Screen[]) => void;

type InternalLocationState<S extends LocationState> = {
    $key: string;
    userState: S;
};

export type StackRoutePattern = {
    pattern: string;
    parent: StackRoutePattern | null;
    hasComponent: boolean;
};

export type StackRoutePayload = {
    component: React.ComponentType<any>;
    pattern: StackRoutePattern;
};

export class StackRouter {
    private initialized = false;
    private screens: Screen[] = [];
    private stackHistory: StackHistory<InternalLocationState<any>>;
    private subscribers = new Set<Subscriber>();
    private route = new Route<StackRoutePayload>();
    private safariEdgeSwipeDetector = createSafariEdgeSwipeDetector();

    private pushOption = new Snapshot<PushOption>();
    private resolve = new Snapshot<() => void>();

    constructor(history: History) {
        this.stackHistory = createStackHistory(history);
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
                stack.unshift(pathname);
                numOfParentComponent--;
            }
            segments.pop();
        }

        return Promise.all(stack.map((to, index) => (index === 0 ? this.replace(to) : this.push(to, {transition: "exiting"}))));
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

        const wait = new Promise<void>(resolve => (this.resolve.value = resolve));
        this.pushOption.value = option ?? null;
        this.stackHistory.push(to, {$key: this.createKey(), userState: option?.state ?? {}});

        return wait;
    }

    async pop(): Promise<void> {
        const wait = new Promise<void>(resolve => (this.resolve.value = resolve));
        this.stackHistory.pop();
        return wait;
    }

    replace(to: To, state?: Record<string, any>): void {
        if (!this.matchRoute(to)) return;
        this.stackHistory.replace(to, {$key: (this.stackHistory.location.state as any)?.$key ?? this.createKey(), userState: state ?? {}});
    }

    replaceHash(hash: string): void {
        const location = this.stackHistory.location;
        this.stackHistory.replace({pathname: location.pathname, search: location.search, hash}, location.state);
    }

    replaceSearchParams(params: Record<string, string>): void {
        const location = this.stackHistory.location;
        const search = new URLSearchParams(params).toString();
        this.stackHistory.replace({pathname: location.pathname, search, hash: location.hash}, location.state);
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

    private createScreen(location: Location, transitionType: TransitionType): Screen | null {
        const matched = this.matchRoute(location.pathname);
        if (!matched) return null;
        return new Screen({
            content: matched.payload.component,
            history: {
                location,
                params: matched.params,
            },
            transition: {
                type: transitionType,
                duration: 400,
            },
        });
    }

    private pushScreen(location: Location, transition: TransitionType): void {
        const option = this.pushOption.value;
        const resolve = this.resolve.value;

        const screen = this.createScreen(location, option?.transition ?? transition);
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

        top?.transition.update(transition);
        top ? top.lifecycle.attachOnce("didExit", () => resolve?.()) : resolve?.();
        this.screens.pop();
        this.notify();
    }

    private replaceScreen(location: Location) {
        const resolve = this.resolve.value;
        const top = this.getTopScreen();

        top?.transition.update("none");
        this.screens.pop();

        const screen = this.createScreen(location, "exiting");
        if (!screen) {
            resolve?.();
            return;
        }

        resolve && screen.lifecycle.attachOnce("didEnter", resolve);
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
