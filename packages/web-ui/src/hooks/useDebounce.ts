import React from "react";

type Callback<T extends any[]> = (...args: T) => void;

export function useDebounce<Param extends any[]>(callback: Callback<Param>, wait: number) {
    const idRef = React.useRef<number>();

    const callbackRef = React.useRef(callback);
    callbackRef.current = callback;

    const waitRef = React.useRef(wait);
    waitRef.current = wait;

    React.useEffect(() => () => window.clearTimeout(idRef.current), []);

    return React.useCallback(function (...args: Param) {
        window.clearTimeout(idRef.current);
        idRef.current = window.setTimeout(() => callbackRef.current(...args), waitRef.current);
    }, []);
}
