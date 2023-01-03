import {Action} from "history";
import {Route} from "./route";
import type {History, Location, To, Update} from "history";
import type {Screen, ScreenTransition} from "./screen";

export interface InternalHistoryState {
    __createAt: number;
    __transition: ScreenTransition;
    state?: unknown;
}

export type Listener = (stack: Screen[]) => void;

export interface PushOptions {
    /**
     * Default: 'both'
     */
    transition?: ScreenTransition;
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
        this.history.replace(to, this.replaceHistoryState(options));
    }

    reset() {}

    private getTopScreen(): Screen | null {
        if (this.screens.length === 0) {
            return null;
        }
        return this.screens[this.screens.length - 1];
    }

    private notifiy() {
        this.listeners.forEach(_ => _(this.screens));
    }

    private createHistoryState(options: PushOptions): InternalHistoryState {
        return {__createAt: Date.now(), __transition: options?.transition ?? "both", state: options?.state};
    }

    private replaceHistoryState(options: ReplaceOptions): InternalHistoryState {
        const currentState = this.history.location.state as InternalHistoryState;
        return {__createAt: currentState.__createAt, __transition: "exiting", state: options.state};
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

    private pushToStack(location: Location): void {
        const matched = this.route.lookup(location.pathname);
        if (!matched) return;
        this.screens.push({
            location,
            component: matched.payload,
            param: matched.param,
            transition: (location.state as InternalHistoryState).__transition,
        });

        this.notifiy();
    }

    private popStack(): void {
        this.screens.pop();
        this.notifiy();
    }

    private replaceStack(location: Location): void {
        this.screens.pop();
        this.pushToStack(location);
    }

    private bindHistory(history: History): void {
        history.listen(this.handleHistoryChange.bind(this));
    }

    private handleHistoryChange({location, action}: Update) {
        switch (action) {
            case Action.Push:
                this.pushToStack(location);
                break;
            case Action.Pop:
                this.isForwardPop(location) ? this.pushToStack(location) : this.popStack();
                break;
            case Action.Replace:
                this.replaceStack(location);
                break;
        }
    }
}
