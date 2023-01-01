import {useContext} from "react";
import {RouteContext, RouterContext} from "./context";
import type {History, Location} from "history";

export type Navigate = Omit<RouterContext, "history">;
export const useNavigate = (): Navigate => {
    const {history: _, ...result} = useContext(RouterContext);
    return result;
};

export const useHistory = (): History => {
    return useContext(RouterContext).history;
};

export const useParam = <T extends Record<string, unknown>>(): T => {
    return useContext(RouteContext).param as T;
};

export const useLocation = (): Location => {
    return useContext(RouteContext).location;
};

export const useSearch = <T extends Record<string, unknown>>(): T => {
    const {search} = useContext(RouteContext);
    return Object.fromEntries(new URLSearchParams(search)) as T;
};
