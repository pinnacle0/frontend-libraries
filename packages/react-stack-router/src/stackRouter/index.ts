import {Action} from "history";
import {Route, formatPath} from "../route";
import {Screen} from "../screen";
import {createKey, invariant} from "../util";
import {createStackHistory} from "./stackHistory";
import type React from "react";
import type {History, Update, To, Key} from "history";
import type {LocationState, Location, PushOption, ReplaceOption} from "../type";
import type {Match} from "../route";
import type {StackHistory} from "./stackHistory";
import {createSafariEdgeSwipeDetector} from "./safariEdgeSwipeDetector";

export type Subscriber = (screens: Screen[]) => void;

type InternalLocationState<S extends LocationState> = {
    $key: Key;
} & S;

export type StackRoutePayload = {
    id: string;
    component: React.ComponentType<any>;
    parent: StackRoutePayload | null;
};

export type StackRouterOptions = {
    history: History;
    transitionDuration: number;
};

export type TransitionType = "entering" | "exiting" | "none";

// TODO: maybe a bit redundant, try simplify it if possible
type InitializeState = "Initialized" | "SettingUpInitialStack" | "Initializing" | "Uninitialized";

export class StackRouter {
    private actionsBeforeInitialized: (() => void)[] = [];
    private state: InitializeState = "Uninitialized";
    private screens: Screen[] = [];
    private stackHistory: StackHistory<InternalLocationState<any>>;
    private subscribers = new Set<Subscriber>();
    private safariEdgeSwipeDetector = createSafariEdgeSwipeDetector();
    private route = new Route<StackRoutePayload>();

    private pushOption = new Snapshot<PushOption>();
    private resolve = new Snapshot<() => void>();
    transitionType: TransitionType = "none";

    constructor(options: StackRouterOptions) {
        this.stackHistory = createStackHistory(options.history);
    }

    async initialize() {
        if (this.state !== "Uninitialized") return;
        this.state = "Initializing";

        const {pathname, hash, search} = window.location;
        const defaultState = this.stackHistory.location.state;
        const matchedRoute = this.validateRoute(pathname);

        const stack: To[] = [{pathname, hash, search}];
        const segments = ["/", ...matchedRoute.matchedSegments];

        let currentParent = matchedRoute.payload.parent;
        while (currentParent !== null && segments.length >= 0) {
            const pathname = formatPath(segments.join("/"));
            const matched = this.route.lookup(pathname);
            if (matched && matched.payload.id === currentParent.id) {
                stack.unshift(pathname.startsWith("/") ? pathname : `/${pathname}`);
                currentParent = currentParent.parent;
            }
            segments.pop();
        }
        this.stackHistory.listen(this.handler.bind(this));
        this.transitionType = "none";
        this.state = "SettingUpInitialStack";
        await Promise.all(
            stack.map((to, index) => {
                // need to re-write the key of last state
                const state = index === stack.length - 1 ? {...defaultState, $key: createKey()} : {};
                return index === 0 ? this.replace(to, {state}) : this.push(to, {state});
            })
        );
        this.state = "Initialized";
        this.actionsBeforeInitialized.forEach(action => action());
        this.actionsBeforeInitialized = [];
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
        if (this.state === "Initializing" || this.state === "Uninitialized") {
            this.actionsBeforeInitialized.push(() => this.push(to, option));
            return;
        }

        this.validateRoute(to);

        this.pushOption.value = option ?? null;
        const wait = new Promise<void>(resolve => (this.resolve.value = resolve));
        this.stackHistory.push(to, {$key: createKey(), ...(option?.state ?? {})});

        return wait;
    }

    async pop(times = 1): Promise<void> {
        if (times <= 0) return;

        let wait!: Promise<void>;

        for (let i = 0; i < times; i++) {
            wait = new Promise<void>(resolve => (this.resolve.value = resolve));
            this.stackHistory.pop();
            // delay 10ms, otherwise consecutive router.pop() will not work in iOS
            if (times > 1) await delay(10);
        }

        return wait;
    }

    async popAll(): Promise<void> {
        return this.pop(this.screens.length - 1);
    }

    replace(to: To, option?: ReplaceOption): void {
        if (this.state === "Initializing" || this.state === "Uninitialized") {
            this.actionsBeforeInitialized.push(() => this.replace(to, option));
            return;
        }
        this.validateRoute(to);
        this.stackHistory.replace(to, {$key: (this.stackHistory.location.state as any)?.$key ?? createKey(), ...(option?.state ?? {})});
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

    private notify() {
        this.subscribers.forEach(_ => _([...this.screens]));
    }

    private getTopScreen(): Screen | null {
        const top = this.screens[this.screens.length - 1];
        return top ?? null;
    }

    private validateRoute(to: To): Match<StackRoutePayload> {
        const pathname = typeof to === "string" ? to : to.pathname;
        const matched = this.route.lookup(pathname ?? window.location.pathname);

        invariant(matched, `None of the route match current pathname: ${pathname}. Please make sure you have defined fallback route using "**"`);
        return matched;
    }

    private createScreen(location: Location): Screen {
        const matchedRoute = this.validateRoute(location.pathname);
        return new Screen({
            content: matchedRoute.payload.component,
            location,
            params: matchedRoute.params,
            searchParams: Object.fromEntries(new URLSearchParams(location.search)),
        });
    }

    private pushScreen(location: Location, transitionType: TransitionType): void {
        const resolve = this.resolve.value;

        this.transitionType = transitionType;
        const screen = this.createScreen(location);
        resolve?.();
        this.screens.push(screen);
        this.notify();
    }

    private popScreen(transitionType: TransitionType) {
        const resolve = this.resolve.value;
        this.transitionType = transitionType;
        const top = this.getTopScreen();
        if (!top) {
            resolve?.();
            return;
        }

        this.screens.pop();
        resolve?.();
        this.notify();
    }

    private replaceScreen(location: Location) {
        this.transitionType = "none";
        this.screens.pop();

        const screen = this.createScreen(location);
        this.screens.push(screen);
        this.notify();
    }

    private handler({action, location}: Update) {
        // safari edge swipe itself have animation, so we need to set the transition type to cancel our own animation otherwise the animation plays twice
        switch (action) {
            case Action.Push:
                this.pushScreen(location as any, this.state === "SettingUpInitialStack" || this.safariEdgeSwipeDetector.isForwardPop ? "none" : "entering");
                break;
            case Action.Pop:
                this.popScreen(this.state === "SettingUpInitialStack" || this.safariEdgeSwipeDetector.isBackwardPop ? "none" : "exiting");
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
