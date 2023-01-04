import type React from "react";
import type {To} from "history";
import type {RouteProps} from "./component/Route";
import type {ScreenTransitionType} from "./ScreenTransition";

export type State = Record<string, any>;

export interface PushOption {
    transition: ScreenTransitionType;
    state?: State;
}

export interface Router {
    Root: React.ComponentType<React.PropsWithChildren>;
    Route: React.ComponentType<RouteProps>;
    push: (to: To, option?: PushOption) => void;
    pop: () => void;
    replace: (to: To, state?: State) => void;
    reset: () => void;
}