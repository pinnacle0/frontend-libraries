import {createContext} from "react";
import type {History} from "history";
import type {Lifecycle} from "./screen/lifecycle";
import type {Location, Router} from "./type";

export interface RouterContext extends Pick<Router, "push" | "replace" | "pop" | "replaceHash" | "replaceSearchParams" | "replaceLocationState" | "popAll"> {
    history: History;
}

export const RouterContext = createContext({} as RouterContext);

export interface RouteContext {
    location: Location;
    params: Record<string, string>;
    searchParams: Record<string, string>;
    lifecycle: Lifecycle;
}

export const RouteContext = createContext({} as RouteContext);
