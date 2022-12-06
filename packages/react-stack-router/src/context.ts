import {createContext} from "react";
import type {History} from "history";
import type {RouterHookResult} from "./hook/useRouter";

interface RouterContext extends Omit<RouterHookResult, "stack"> {
    history: History;
}

export const RouterContext = createContext({} as RouterContext);

interface RouteContext {
    param: {[key: string]: any};
    pathname: string;
    search: string;
}

export const RouteContext = createContext({} as RouteContext);
