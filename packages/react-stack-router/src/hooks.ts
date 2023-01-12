import {useContext, useEffect} from "react";
import {RouteContext, RouterContext} from "./context";
import type {History, Location} from "history";

export type Navigate = Omit<RouterContext, "history">;
export const useNavigate = (): Navigate => {
    const {push, pop, reset, replace} = useContext(RouterContext);
    return {push, pop, reset, replace};
};

export const useHistory = (): History => {
    return useContext(RouterContext).history;
};

export const useParams = <T extends Record<string, unknown>>(): T => {
    return useContext(RouteContext).params as T;
};

export const useLocation = (): Location => {
    return useContext(RouteContext).location;
};

export const useSearch = <T extends Record<string, unknown>>(): T => {
    const {search} = useLocation();
    return Object.fromEntries(new URLSearchParams(search)) as T;
};

export const useWillEnterEffect = (callback: () => any) => {
    const {lifecycle} = useContext(RouteContext);

    useEffect(() => {
        return lifecycle.attach("willEnter", callback);
    }, [callback, lifecycle]);
};

export const useDidEnterEffect = (callback: () => any) => {
    const {lifecycle} = useContext(RouteContext);

    useEffect(() => {
        return lifecycle.attach("didEnter", callback);
    }, [callback, lifecycle]);
};

export const useWillExitEffect = (callback: () => any) => {
    const {lifecycle} = useContext(RouteContext);

    useEffect(() => {
        return lifecycle.attach("willExit", callback);
    }, [callback, lifecycle]);
};

export const useDidExitEffect = (callback: () => any) => {
    const {lifecycle} = useContext(RouteContext);

    useEffect(() => {
        return lifecycle.attach("didExit", callback);
    }, [callback, lifecycle]);
};
