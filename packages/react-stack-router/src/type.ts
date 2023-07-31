import type React from "react";
import type {To, Location as HistoryLocation} from "history";
import type {RouteProps} from "./component/Route";
import type {TransitionType} from "./screen/transition";

export type LocationState = Record<string, any>;

export type Location<S extends Record<string, any> = Record<string, any>> = Omit<HistoryLocation, "state"> & {
    state: S;
};

export interface TransitionOption {
    transition?: TransitionType;
    duration?: number;
}

export interface PushOption extends TransitionOption {
    state?: LocationState;
}

export interface ReplaceOption {
    remove: TransitionOption;
    add: TransitionOption;
    state?: LocationState;
}

export interface Router {
    Root: React.ComponentType<React.PropsWithChildren>;
    Route: React.ComponentType<RouteProps>;
    push: (to: To, option?: PushOption) => Promise<void>;
    pop: () => Promise<void>;
    replace: (to: To, state?: Record<string, any>) => void;
    replaceHash: (hash: string) => void;
}
