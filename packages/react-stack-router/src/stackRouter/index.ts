import {Action} from "history";
import {Route} from "../route";
import {createStackHistory} from "./stackHistory";
import {createSafariEdgeSwipeDetector} from "./safariEdgeSwipeDetector";
import {invariant} from "../invariant";
import type React from "react";
import type {History, Location, Update, To} from "history";
import type {HistoryState, PushOption} from "../type";
import type {StackHistory} from "./stackHistory";
import type {ScreenTransitionType} from "./screenTransition";
import {Screen} from "./screen";

export type Subscriber = (screens: Screen[]) => void;

export class StackRouter {
    private initialized = false;
    private screens: Screen[] = [];
    private stackHistory: StackHistory<HistoryState>;
    private subscribers = new Set<Subscriber>();
    private route = new Route<React.ComponentType<any>>();
    private pushOptionQueue: Array<PushOption | undefined> = [];
    private pushResolver: (() => void) | null = null;
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

    async push(to: To, option?: PushOption): Promise<void> {
        const wait = new Promise<void>(resolve => (this.pushResolver = resolve));
        this.pushOptionQueue.push(option);
        this.stackHistory.push(to, option?.state);

        return wait;
    }

    pop() {
        this.stackHistory.pop();
    }

    replace(to: To, state?: Record<string, any>) {
        this.stackHistory.replace(to, state);
    }

    reset() {}

    private notify() {
        this.subscribers.forEach(_ => _([...this.screens]));
    }

    private updateTopScreenTransition(transition: ScreenTransitionType) {
        const top = this.screens[this.screens.length - 1];
        top && top.transition.update(transition);
    }

    private getCurrentPushOption(): PushOption | undefined {
        return this.pushOptionQueue.pop();
    }

    private pushScreen(location: Location, transition: ScreenTransitionType): void {
        const matched = this.route.lookup(location.pathname);
        const userOption = this.getCurrentPushOption();
        if (!matched) return;

        const screen = new Screen({
            content: matched.payload,
            history: {
                location,
                params: matched.params,
            },
            transition: {
                type: userOption?.transition ?? transition,
                duration: 2000,
            },
        });

        const currentResolver = this.pushResolver;
        this.pushResolver = null;
        if (currentResolver) {
            const unattch = screen.lifecycle.attach("didEnter", () => {
                currentResolver?.();
                unattch();
            });
        }

        this.screens.push(screen);
        this.notify();
    }

    private popScreen() {
        this.screens.pop();
        this.notify();
    }

    private replaceScreen(location: Location) {
        this.updateTopScreenTransition("none");
        this.screens.pop();
        this.pushScreen(location, "exiting");
    }

    private handler({action, location}: Update) {
        switch (action) {
            case Action.Push:
                this.pushScreen(location, this.safariEdgeSwipeDetector.isForwardPop ? "exiting" : "both");
                break;
            case Action.Pop:
                this.safariEdgeSwipeDetector.isBackwardPop && this.updateTopScreenTransition("none");
                this.popScreen();
                break;
            case Action.Replace:
                this.replaceScreen(location);
                break;
        }
    }
}
