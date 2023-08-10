import type React from "react";
import type {To, Location as HistoryLocation} from "history";
import type {RouteProps} from "./component/Route";
import type {TransitionType} from "./screen/transition";
import type {Lifecycle} from "./screen/lifecycle";

export type LocationState = Record<string, any>;
export type Path = string | To;

export type Location<S extends Record<string, any> = Record<string, any>> = Omit<HistoryLocation, "state"> & {
    state: Partial<S>;
};

export interface PushOption {
    state?: LocationState | undefined;
    transitionType?: TransitionType;
    transitionDuration?: number;
}

export interface ReplaceOption {
    state?: LocationState | undefined;
}

export interface Router {
    Root: React.ComponentType<React.PropsWithChildren>;
    Route: React.ComponentType<RouteProps>;
    push: (to: To, option?: PushOption) => Promise<void>;
    pop: (times?: number) => Promise<void>;
    replace: (to: To, option?: ReplaceOption) => void;
    replaceHash: (hash: string) => void;
    replaceSearchParams: <T extends Record<string, string> = Record<string, string>>(newParam: T | ((current: T) => T)) => void;
    replaceLocationState: <T extends LocationState = LocationState>(newState: T | ((current: T) => T)) => void;
}

export interface RouteRenderProps<Params extends Record<string, string>, SearchParams extends Record<string, string> = Record<string, string>, State extends LocationState = LocationState> {
    location: Location<State>;
    params: Params;
    searchParams: SearchParams;
    lifecycle: Lifecycle;
}
