import type React from "react";
import type {To} from "history";
import type {RouteProps} from "./component/Route";
import type {TransitionType} from "./screen/transition";

export type HistoryState = Record<string, any>;

interface TransitionOption {
    transition?: TransitionType;
    duration?: number;
}

export interface PushOption extends TransitionOption {
    state?: HistoryState;
}

export type PopOption = TransitionOption;

export interface ReplaceOption {
    remove: TransitionOption;
    add: TransitionOption;
    state?: HistoryState;
}

export interface Router {
    Root: React.ComponentType<React.PropsWithChildren>;
    Route: React.ComponentType<RouteProps>;
    push: (to: To, option?: PushOption) => Promise<void>;
    pop: (option?: PopOption) => Promise<void>;
    replace: (to: To, state?: Record<string, any>) => Promise<void>;
    reset: () => void;
}
