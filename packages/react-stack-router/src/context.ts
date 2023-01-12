import {createContext} from "react";
import type {StackRouter} from "./stackRouter";
import type {History, Location} from "history";
import type {ScreenLifecycle} from "./stackRouter/screenLifecycle";

export interface RouterContext extends Pick<StackRouter, "push" | "replace" | "pop" | "reset"> {
    history: History;
}

export const RouterContext = createContext({} as RouterContext);

export interface RouteContext {
    params: {[key: string]: any};
    location: Location;
    lifecycle: ScreenLifecycle;
}

export const RouteContext = createContext({} as RouteContext);
