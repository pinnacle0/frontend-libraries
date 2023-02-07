import React from "react";

type Callback<T extends any[]> = (...args: T) => void;

export const useDebounce = function <Param extends any[]>(callback: Callback<Param>, wait: number) {
    const idRef = React.useRef<number>();
    const callbackRef = React.useRef(callback);
    callbackRef.current = callback;

    const debounce = React.useCallback(() => {
        return function (...args: Param) {
            clearTimeout(idRef.current);
            idRef.current = window.setTimeout(() => {
                callbackRef.current(...args);
            }, wait);
        };
    }, [wait]);

    React.useEffect(() => () => clearTimeout(idRef.current), []);
    return React.useMemo(() => debounce(), [debounce]);
};
