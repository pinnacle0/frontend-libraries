import {use, useCallback, useEffect, useLayoutEffect, useMemo, useRef} from "react";
import {RouteContext, RouterContext} from "./context";
import type {History} from "history";
import type {LocationState, Location} from "./type";
import type {LifecycleHook} from "./screen/lifecycle";

/**
 * Route History hooks
 */
export type Navigate = Omit<RouterContext, "history">;
export const useNavigate = (): Navigate => {
    const {push, pop, popAll, replace, replaceHash, replaceSearchParams, replaceLocationState} = use(RouterContext);
    return {push, pop, popAll, replace, replaceHash, replaceSearchParams, replaceLocationState};
};

export const useHistory = (): History => {
    return use(RouterContext).history;
};

export const useLocation = (): Location => {
    return use(RouteContext).location;
};

export const useParams = <T extends Record<string, string>>(): T => {
    return use(RouteContext).params as T;
};

export const useLocationState = <T extends LocationState>() => {
    const {state} = useLocation();
    const {replaceLocationState} = useNavigate();
    const setState = useCallback((newState: Partial<T> | ((current: Partial<T>) => T)) => replaceLocationState(newState), [replaceLocationState]);
    return [state as Partial<T>, setState] as const;
};

export const useHash = () => {
    const location = useLocation();
    const {replaceHash} = useNavigate();
    const setHash = useCallback((hash: string) => replaceHash(hash), [replaceHash]);
    return [location.hash.slice(1), setHash] as const;
};

export const useSearchParams = <T extends Record<string, string>>() => {
    const {search} = useLocation();
    const {replaceSearchParams} = useNavigate();
    const searchParams = useMemo(() => Object.fromEntries(new URLSearchParams(search)), [search]) as T;
    const setSearchParams = useCallback((newParams: T | ((current: T) => T)) => replaceSearchParams(newParams), [replaceSearchParams]);
    return [searchParams, setSearchParams] as const;
};

export type LocationMatchCallback = (location: Location) => void;

export const useLocationMatch = (callback: LocationMatchCallback) => {
    const {
        history: {location: currentLocation},
    } = use(RouterContext);
    const location = useLocation();

    const callbackRef = useRef(callback);
    callbackRef.current = callback;

    useEffect(() => {
        if (location.key === currentLocation.key) {
            callbackRef.current(location);
        }
    }, [location, currentLocation.key]);
};

/**
 * Screen lifecycle hooks
 */

export const useWillEnterEffect = (callback: () => any) => useLifecycle("willEnter", callback);

export const useDidEnterEffect = (callback: () => any) => useLifecycle("didEnter", callback);

export const useWillExitEffect = (callback: () => any) => useLifecycle("willExit", callback);

export const useDidExitEffect = (callback: () => any) => useLifecycle("didExit", callback);

function useLifecycle(hook: LifecycleHook, callback: () => void) {
    const {lifecycle} = use(RouteContext);
    const callbackRef = useRef(callback);
    callbackRef.current;

    useLayoutEffect(() => {
        const unsubscribe = lifecycle.attach(hook, () => callbackRef.current());
        return () => unsubscribe();
    }, [hook, lifecycle]);
}
