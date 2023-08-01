import {useCallback, useContext, useEffect, useLayoutEffect, useRef} from "react";
import {RouteContext, RouterContext} from "./context";
import type {History} from "history";
import type {LocationState, Location} from "./type";
import type {LifecycleHook} from "./screen/lifecycle";

/**
 * Route History hooks
 */
export type Navigate = Omit<RouterContext, "history">;
export const useNavigate = (): Navigate => {
    const {push, pop, replace, replaceHash} = useContext(RouterContext);
    return {push, pop, replace, replaceHash};
};

export const useHistory = (): History => {
    return useContext(RouterContext).history;
};

export const useLocation = (): Location => {
    return useContext(RouteContext).location;
};

export function useLocationState<T extends LocationState>(): Partial<T> {
    const location = useLocation();
    if ("userState" in location.state) {
        return location.state.userState;
    }
    return {};
}

export const useParams = <T extends Record<string, string>>(): T => {
    return useContext(RouteContext).params as T;
};

export const useHash = () => {
    const {location} = useContext(RouteContext);
    const {replaceHash} = useContext(RouterContext);
    const hash = location.hash.slice(1);
    const setHash = useCallback((hash: string) => replaceHash(hash), [replaceHash]);

    return [hash, setHash] as const;
};

export const useSearch = <T extends Record<string, unknown>>(): T => {
    const {search} = useLocation();
    return Object.fromEntries(new URLSearchParams(search)) as T;
};

export type LocationMatchCallback = (location: Location) => void;

export const useLocationMatch = (callback: LocationMatchCallback) => {
    const {
        history: {location: currentLocation},
    } = useContext(RouterContext);
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
    const {lifecycle} = useContext(RouteContext);
    const callbackRef = useRef(callback);
    callbackRef.current;

    useLayoutEffect(() => {
        const unsubscribe = lifecycle.attach(hook, () => callbackRef.current());
        return () => unsubscribe();
    }, [hook, lifecycle]);
}
