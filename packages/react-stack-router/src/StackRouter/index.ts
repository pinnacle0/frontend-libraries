import {Action} from "history";
import {Route} from "../route";
import {createStackHistory} from "./stackHistory";
import {createSafariEdgeSwipeDetector} from "./safariEdgeSwipeDetector";
import {ScreenTransition} from "./screenTransition";
import {invariant} from "../util/invariant";
import type React from "react";
import type {History, Location, Update, To} from "history";
import type {State, PushOption} from "../type";
import type {StackHistory} from "./stackHistory";
import type {ScreenTransitionType} from "./screenTransition";

export interface ScreenData {
    component: React.ComponentType<any>;
    params: Record<string, string>;
    location: Location;
    transition: ScreenTransition;
}

export type Subscriber = (screens: ScreenData[]) => void;

export class StackRouter {
    private screens: ScreenData[] = [];
    private stackHistory: StackHistory<State>;
    private initialized = false;
    private subscribers = new Set<Subscriber>();
    private route = new Route<React.ComponentType<any>>();
    private userSpecifiedTransitionQueue: Array<ScreenTransitionType | undefined> = [];
    private safariEdgeSwipeDetector = createSafariEdgeSwipeDetector();

    constructor(history: History) {
        this.stackHistory = createStackHistory(history);
        this.stackHistory.listen(this.handler.bind(this));
    }

    initialize() {
        if (this.initialized) return;
        this.initialized = true;

        const {hash, search, pathname} = window.location;
        const matched = this.route.lookup(pathname);

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

    push(to: To, option?: PushOption) {
        this.userSpecifiedTransitionQueue.push(option?.transition as ScreenTransitionType | undefined);
        this.stackHistory.push(to, option?.state);
    }

    pop() {
        this.stackHistory.pop();
    }

    replace(to: To, state?: State) {
        this.stackHistory.replace(to, state);
    }

    reset() {}

    private notify() {
        this.subscribers.forEach(_ => _([...this.screens]));
    }

    private changeTopScreenTransition(transition: ScreenTransitionType) {
        const top = peek(this.screens);
        top && top.transition.update(transition);
    }

    private pushScreen(location: Location, transition: ScreenTransitionType): void {
        const matched = this.route.lookup(location.pathname);
        const currentTranstion: ScreenTransitionType = this.userSpecifiedTransitionQueue.pop() ?? transition;

        if (!matched) return;
        this.screens.push({
            location,
            component: matched.payload,
            params: matched.params,
            transition: new ScreenTransition(currentTranstion),
        });
        this.notify();
    }

    private popScreen() {
        this.screens.pop();
        this.notify();
    }

    private replaceScreen(location: Location) {
        this.changeTopScreenTransition("none");
        this.screens.pop();
        this.pushScreen(location, "exiting");
    }

    private handler({action, location}: Update) {
        switch (action) {
            case Action.Push:
                this.pushScreen(location, this.safariEdgeSwipeDetector.isForwardPop ? "exiting" : "both");
                break;
            case Action.Pop:
                this.safariEdgeSwipeDetector.isBackwardPop && this.changeTopScreenTransition("none");
                this.popScreen();
                break;
            case Action.Replace:
                this.replaceScreen(location);
                break;
        }
    }
}

function peek<T>(target: T[]): T | undefined {
    if (target.length === 0) {
        return undefined;
    }
    return target[target.length - 1];
}
