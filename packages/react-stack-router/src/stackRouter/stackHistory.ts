import {Action} from "history";
import type {History, Location, To, Update} from "history";

interface InternalState {
    __createAt: number;
    [key: string]: unknown;
}

export type Listener = (update: Update) => void;

export interface StackHistory<S extends Record<string, any>> {
    listen: (listener: Listener) => () => void;
    push: (to: To, state?: S) => void;
    replace: (to: To, state?: S) => void;
    pop: () => void;
    currentLocation: Location;
}

export const createStackHistory = <S extends Record<string, any>>(history: History): StackHistory<S> => {
    const listeners = new Set<Listener>();
    let timestamp = Date.now();
    let currentLocation = history.location;

    const createInternalState = (state?: S, createAt?: number): InternalState => {
        return {__createAt: createAt ?? timestamp++, ...(state ?? {})};
    };

    const push = (to: To, state?: S) => {
        history.push(to, createInternalState(state));
    };

    const pop = () => {
        history.back();
    };

    const replace = (to: To, state?: S) => {
        history.replace(to, createInternalState(state, (currentLocation.state as InternalState)?.__createAt));
    };

    const listen = (listener: Listener) => {
        listeners.add(listener);
        return () => listeners.delete(listener);
    };

    const notify = (action: Action, location: Location) => {
        listeners.forEach(_ => _({action, location}));
    };

    /**
     * Determine a popState event is trigger by back or forward
     */
    const isForwardPop = (next: Location): boolean => {
        if (!currentLocation.state) return false;
        const currentState = currentLocation.state as InternalState;
        const nextState = next.state as InternalState;
        return nextState.__createAt > currentState.__createAt;
    };

    const handler = ({action, location}: Update) => {
        switch (action) {
            case Action.Push:
                notify(Action.Push, location);
                break;
            case Action.Pop:
                notify(isForwardPop(location) ? Action.Push : Action.Pop, location);
                break;
            case Action.Replace:
                notify(Action.Replace, location);
                break;
        }
        currentLocation = location;
    };

    history.listen(handler);

    return {
        push,
        pop,
        replace,
        listen,
        get currentLocation() {
            return currentLocation;
        },
    };
};
