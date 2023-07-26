import type React from "react";
import type {To} from "history";
import type {RouteProps} from "./component/Route";
import type {TransitionType} from "./screen/transition";
import type {RouteContext} from "./context";

export type HistoryState = Record<string, any>;

export interface TransitionOption {
    transition?: TransitionType;
    duration?: number;
}

export interface PushOption extends TransitionOption {
    state?: HistoryState;
}

export interface ReplaceOption {
    remove: TransitionOption;
    add: TransitionOption;
    state?: HistoryState;
}

export interface RouteRenderBaseProps {
    $routeProps: RouteContext;
}

export interface Router {
    Root: React.ComponentType<React.PropsWithChildren>;
    Route: React.ComponentType<RouteProps>;
    push: (to: To, option?: PushOption) => Promise<void>;
    pop: () => Promise<void>;
    replace: (to: To, state?: Record<string, any>) => Promise<void>;
    reset: () => void;
}
