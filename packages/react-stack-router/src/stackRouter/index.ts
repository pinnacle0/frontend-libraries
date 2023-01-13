import {Action} from "history";
import {Route} from "../route";
import {Screen} from "../screen";
import {invariant} from "../invariant";
import {createStackHistory} from "./stackHistory";
import {createSafariEdgeSwipeDetector} from "./safariEdgeSwipeDetector";
import type React from "react";
import type {History, Location, Update, To} from "history";
import type {HistoryState, PushOption} from "../type";
import type {StackHistory} from "./stackHistory";
import type {Transition, TransitionType} from "../screen/transition";

export type Subscriber = (screens: Screen[]) => void;

export class StackRouter {
    private initialized = false;
    private screens: Screen[] = [];
    private stackHistory: StackHistory<HistoryState>;
    private subscribers = new Set<Subscriber>();
    private route = new Route<React.ComponentType<any>>();
    private safariEdgeSwipeDetector = createSafariEdgeSwipeDetector();

    private pushOption: PushOption | undefined = undefined;
    private resolve: (() => void) | null = null;

    constructor(history: History) {
        this.stackHistory = createStackHistory(history);
        this.stackHistory.listen(this.handler.bind(this));
    }

    initialize() {
        if (this.initialized) return;
        this.initialized = true;

        const {hash, search, pathname} = window.location;
        const matched = this.matchRoute(pathname);
        invariant(matched, `None of the route match current pathname:${pathname}. Please make sure you have defined fallback route using "**"`);

        [
            ...matched.parents
                .filter(_ => _.payload)
                .map((_, index) => ({
                    pathname:
                        "/" +
                        matched.parents
                            .slice(0, index + 1)
                            .map(_ => _.matchedSegment)
                            .join("/"),
                })),
            {hash, search, pathname},
        ].forEach((to, index) => (index === 0 ? this.replace(to) : this.push(to, {transition: "exiting"})));
    }

    updateRoute(route: Route<React.ComponentType<any>>) {
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
        const wait = new Promise<void>(resolve => (this.resolve = resolve));
        if (!this.matchRoute(to)) return;
        option && (this.pushOption = option);
        this.stackHistory.push(to, option?.state);

        return wait;
    }

    pop() {
        this.stackHistory.pop();
    }

    replace(to: To, state?: Record<string, any>) {
        if (!this.matchRoute(to)) return;
        this.stackHistory.replace(to, state);
    }

    reset() {}

    private notify() {
        this.subscribers.forEach(_ => _([...this.screens]));
    }

    private updateTopScreenTransition(transition: TransitionType) {
        const top = this.screens[this.screens.length - 1];
        top && top.transition.update(transition);
    }

    private matchRoute(to: To) {
        const pathname = typeof to === "string" ? to : to.pathname;
        return this.route.lookup(pathname ?? window.location.pathname);
    }

    private createScreen(location: Location, transitionType: TransitionType): Screen | null {
        const matched = this.matchRoute(location.pathname);
        if (!matched) return null;
        return new Screen({
            content: matched.payload,
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
        const option = this.pushOption;
        this.pushOption = undefined;
        const resolve = this.resolve;
        this.resolve = null;

        const screen = this.createScreen(location, option?.transition ?? transition);
        if (!screen) return;
        if (resolve) screen.lifecycle.attachOnce("didEnter", resolve);
        this.screens.push(screen);
        this.notify();
    }

    private popScreen(transition?: TransitionType) {
        transition && this.updateTopScreenTransition(transition);
        this.screens.pop();
        this.notify();
    }

    private replaceScreen(location: Location) {
        this.updateTopScreenTransition("none");
        this.screens.pop();

        const screen = this.createScreen(location, "exiting");
        if (!screen) return;
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
