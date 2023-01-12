import type React from "react";
import type {To} from "history";
import type {RouteProps} from "./component/Route";
import type {ScreenTransitionType} from "./stackRouter/screenTransition";

export type HistoryState = Record<string, any>;

export interface PushOption {
    transition?: ScreenTransitionType;
    state?: HistoryState;
}

export interface Router {
    Root: React.ComponentType<React.PropsWithChildren>;
    Route: React.ComponentType<RouteProps>;
    push: (to: To, option?: PushOption) => Promise<void>;
    pop: () => void;
    replace: (to: To, state?: Record<string, any>) => void;
    reset: () => void;
}
