import {Action} from "history";
import type {History, Location, To, Update} from "history";
import type {Route} from "./route";

export interface Stack {
    location: Location;
    component: React.ComponentType<any>;
    param: {[key: string]: string};
}

export const BASE_URL = "/";
export type Listener = (stack: Stack[]) => void;

export class Router {
    private stack: Stack[] = [];
    private listeners: Set<Listener> = new Set();
    private unlistenHistory: (() => void) | null = null;

    constructor(private route: Route<React.ComponentType<any>>, private history: History) {
        const {hash, search, pathname} = window.location;
        const state = window.history.state;

        if (pathname === BASE_URL) {
            this.pushToStack({pathname, key: "@@root", hash, search, state});
        } else {
            this.pushToStack({hash: "", search: "", pathname: BASE_URL, key: "@@root", state: {}});
            this.pushToStack({pathname, key: "@@first-enter", hash, search, state});
        }

        this.listenHistory(history);
    }

    getStack() {
        return this.stack;
    }

    update(route: Route<React.ComponentType<any>>, history: History) {
        this.route = route;
        if (history !== this.history) {
            this.history = history;
            this.listenHistory(history);
        }
    }

    listen(listener: Listener): () => void {
        this.listeners.add(listener);
        return () => this.listeners.delete(listener);
    }

    push(to: To, state?: any) {
        this.history.push(to, state);
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

    private listenHistory(history: History): void {
        this.unlistenHistory?.();
        this.unlistenHistory = history.listen(this.handleHistoryChange.bind(this));
    }

    private handleHistoryChange({location, action}: Update) {
        switch (action) {
            case Action.Push:
                this.pushToStack(location);
                break;
            case Action.Pop:
                this.popStack();
                break;
            case Action.Replace:
                this.replaceStack(location);
                break;
        }
    }
}
