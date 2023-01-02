import {Action} from "history";
import {Route} from "./route";
import type {History, Location, To, Update} from "history";

export interface Stack {
    location: Location;
    component: React.ComponentType<any>;
    param: {[key: string]: string};
}

interface InternalHistoryState {
    createAt: number;
    state?: unknown;
}

export const BASE_URL = "/";
export type Listener = (stack: Stack[]) => void;

export class Router {
    private stack: Stack[] = [];
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
            this.push({hash, search, pathname});
        }
    }

    updateRoute(route: Route<React.ComponentType<any>>) {
        this.route = route;
    }

    listen(listener: Listener): () => void {
        this.listeners.add(listener);
        return () => this.listeners.delete(listener);
    }

    push(to: To, state?: InternalHistoryState) {
        this.history.push(to, this.createHistoryState(state));
    }

    pop() {
        this.history.back();
    }

    replace(to: To, state?: any) {
        this.history.replace(to, state);
    }

    reset() {}

    private notifiy() {
        this.listeners.forEach(_ => _(this.stack));
    }

    private createHistoryState(userState?: unknown): InternalHistoryState {
        return {createAt: Date.now(), state: userState};
    }

    private isForwardPop(nextLocation: Location): boolean {
        const currentState = this.stack[this.stack.length - 1].location.state as InternalHistoryState;
        const nextState = nextLocation.state as InternalHistoryState;
        return nextState.createAt > currentState.createAt;
    }

    private pushToStack(location: Location): void {
        const matched = this.route.lookup(location.pathname);
        if (!matched) return;
        this.stack.push({
            location,
            component: matched.payload,
            param: matched.param,
        });

        this.notifiy();
    }

    private popStack(): void {
        this.stack.pop();
        this.notifiy();
    }
    private replaceStack(location: Location): void {
        this.stack.pop();
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
