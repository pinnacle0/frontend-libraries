import {Route} from "./route";
import type {History, Location, To, Update} from "history";
import {Action} from "history";

export type ScreenTransitionType = "entering" | "exiting" | "both" | "none";

export interface InternalHistoryState {
    __createAt: number;
    __transition: ScreenTransitionType;
    state?: unknown;
}

export interface Screen {
    location: Location;
    component: React.ComponentType<any>;
    param: {[key: string]: string};
}

export type Listener = (screens: Screen[]) => void;

export interface PushOptions {
    /**
     * Default: 'both'
     */
    transition?: ScreenTransitionType;
    state?: any;
}

export interface ReplaceOptions {
    state?: any;
}

const BASE_URL = "/";

export class Router {
    private screens: Screen[] = [];
    private initialized: boolean = false;
    private listeners: Set<Listener> = new Set();
    private route: Route<React.ComponentType<any>> = new Route();

    constructor(private history: History) {
        this.bindHistory(history);
    }

    initialize() {
        if (this.initialized) return;
        this.initialized = true;
        const {hash, search, pathname} = window.location;
        if (pathname === BASE_URL) {
            this.replace({pathname, search, hash});
        } else {
            this.replace({pathname: BASE_URL});
            this.push({hash, search, pathname}, {transition: "exiting"});
        }
    }

    updateRoute(route: Route<React.ComponentType<any>>) {
        this.route = route;
    }

    listen(listener: Listener): () => void {
        this.listeners.add(listener);
        return () => this.listeners.delete(listener);
    }

    push(to: To, options: PushOptions = {}) {
        this.history.push(to, this.createHistoryState(options));
    }

    pop() {
        this.history.back();
    }

    replace(to: To, options: ReplaceOptions = {}) {
        if (this.isInternalState(this.history.location)) {
            (this.history.location.state as InternalHistoryState).__transition = "none";
        }
        this.history.replace(to, this.createHistoryState({...options, transition: "exiting"}));
    }

    reset() {}

    private getTopScreen(): Screen | null {
        if (this.screens.length === 0) {
            return null;
        }
        return this.screens[this.screens.length - 1];
    }

    private isInternalState(location: Location): boolean {
        if (!location.state) {
            return false;
        }
        return "__createAt" in (location.state as object);
    }

    private notifiy() {
        this.listeners.forEach(_ => _(this.screens));
    }

    private createHistoryState(options: PushOptions): InternalHistoryState {
        return {__createAt: Date.now(), __transition: options?.transition ?? "both", state: options?.state};
    }

    // Internal History Handler

    /**
     * Determine a popState event is trigger by back or forward
     */
    private isForwardPop(nextLocation: Location): boolean {
        const top = this.getTopScreen();
        if (!top) return false;
        const currentState = top.location.state as InternalHistoryState;
        const nextState = nextLocation.state as InternalHistoryState;
        return nextState.__createAt > currentState.__createAt;
    }

    private pushStack(location: Location): void {
        const matched = this.route.lookup(location.pathname);
        if (!matched) return;
        this.screens.push({
            location,
            component: matched.payload,
            param: matched.param,
        });

        this.notifiy();
    }

    private popStack(): void {
        this.screens.pop();
        this.notifiy();
    }

    private replaceTopScreen(location: Location): void {
        this.screens.pop();
        this.pushStack(location);
    }

    private bindHistory(history: History): void {
        history.listen(this.handleHistoryChange.bind(this));
    }

    private handleHistoryChange({location, action}: Update) {
        switch (action) {
            case Action.Push:
                this.pushStack(location);
                break;
            case Action.Pop:
                this.isForwardPop(location) ? this.pushStack(location) : this.popStack();
                break;
            case Action.Replace:
                this.replaceTopScreen(location);
                break;
        }
    }
}
