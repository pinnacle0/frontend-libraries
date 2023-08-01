import {createContext} from "react";
import type {History} from "history";
import type {Lifecycle} from "./screen/lifecycle";
import type {Location, Router} from "./type";

export interface RouterContext extends Pick<Router, "push" | "replace" | "pop" | "replaceHash"> {
    history: History;
}

export const RouterContext = createContext({} as RouterContext);

export interface RouteContext {
    params: {[key: string]: any};
    location: Location;
    lifecycle: Lifecycle;
}

export const RouteContext = createContext({} as RouteContext);
