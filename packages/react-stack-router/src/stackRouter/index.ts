import {Action} from "history";
import type {Match} from "../route";
import {Route} from "../route";
import {Screen} from "../screen";
import {invariant} from "../invariant";
import {createStackHistory} from "./stackHistory";
import {createSafariEdgeSwipeDetector} from "./safariEdgeSwipeDetector";
import type React from "react";
import type {History, Location, Update, To} from "history";
import type {HistoryState, PushOption} from "../type";
import type {StackHistory} from "./stackHistory";
import type {TransitionType} from "../screen/transition";

export type Subscriber = (screens: Screen[]) => void;

export type StackRoutePayload = {
    component: React.ComponentType<any>;
    singlePageOnload: boolean;
};

export class StackRouter {
    private initialized = false;
    private screens: Screen[] = [];
    private stackHistory: StackHistory<HistoryState>;
    private subscribers = new Set<Subscriber>();
    private route = new Route<StackRoutePayload>();
    private safariEdgeSwipeDetector = createSafariEdgeSwipeDetector();

    private pushOption = new Snapshot<PushOption>();
    private resolve = new Snapshot<() => void>();

    constructor(history: History) {
        this.stackHistory = createStackHistory(history);
        this.stackHistory.listen(this.handler.bind(this));
    }

    initialize() {
        if (this.initialized) return;
        this.initialized = true;

        const {hash, search, pathname} = window.location;
        const matched = this.matchRoute(pathname);

        if (matched.payload.singlePageOnload) {
            this.replace({pathname, search, hash}, {transition: "none"});
            return;
        }

        const stackPaths = matched.parents.reduce((paths, curr) => {
            if (curr.payload) {
                return [...paths, (paths[paths.length - 1] ?? "") + "/" + curr.matchedSegment];
            }
            return paths;
        }, [] as To[]);

        stackPaths.push({hash, search, pathname});
        this.replace("/");
        stackPaths.forEach(to => this.push(to, {transition: "exiting"}));
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
        this.stackHistory.push(to, option?.state);

        return wait;
    }

    async pop(): Promise<void> {
        const wait = new Promise<void>(resolve => (this.resolve.value = resolve));
        this.stackHistory.pop();
        return wait;
    }

    async replace(to: To, state?: Record<string, any>): Promise<void> {
        if (!this.matchRoute(to)) return;

        const wait = new Promise<void>(resolve => (this.resolve.value = resolve));
        this.stackHistory.replace(to, state);
        return wait;
    }

    reset() {}

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
                this.pushScreen(location, this.safariEdgeSwipeDetector.isForwardPop ? "none" : "both");
                break;
            case Action.Pop:
                this.popScreen(this.safariEdgeSwipeDetector.isBackwardPop ? "none" : "both");
                break;
            case Action.Replace:
                this.replaceScreen(location);
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
