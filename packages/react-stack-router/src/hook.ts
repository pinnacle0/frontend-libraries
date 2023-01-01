import {useContext} from "react";
import {RouteContext, RouterContext} from "./context";
import type {History} from "history";

export type Navigate = Omit<RouterContext, "history">;
export const useNavigate = (): Navigate => {
    const {history: _, ...result} = useContext(RouterContext);
    return result;
};

export const useHistory = (): History => {
    return useContext(RouterContext).history;
};

export const useParam = <T extends object>(): T => {
    return useContext(RouteContext).param as T;
};

export const useSearch = (): string => {
    return useContext(RouteContext).search;
};
