import {createContext} from "react";
import type {StackRouter} from "./stackRouter";
import type {History, Location} from "history";

export interface RouterContext extends Pick<StackRouter, "push" | "replace" | "pop" | "reset"> {
    history: History;
}

export const RouterContext = createContext({} as RouterContext);

export interface RouteContext {
    params: {[key: string]: any};
    location: Location;
}

export const RouteContext = createContext({} as RouteContext);
