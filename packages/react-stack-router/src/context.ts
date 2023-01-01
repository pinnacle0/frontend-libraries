import {createContext} from "react";
import type {History, Location} from "history";
import type {Router} from "./router";

export interface RouterContext extends Pick<Router, "push" | "replace" | "pop" | "reset"> {
    history: History;
}

export const RouterContext = createContext({} as RouterContext);

export interface RouteContext {
    param: {[key: string]: any};
    pathname: string;
    search: string;
    location: Location;
}

export const RouteContext = createContext({} as RouteContext);
