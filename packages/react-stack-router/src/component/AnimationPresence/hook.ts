import {useCallback, useLayoutEffect, useRef, useState} from "react";

export function useForceUpdate() {
    const [, setState] = useState<any>();
    const forceUpdate = useCallback(() => setState({}), []);
    return forceUpdate;
}

export function usePrevious<T>(value: T): T {
    const previous = useRef(value);

    useLayoutEffect(() => {
        previous.current = value;
    }, [value]);

    return previous.current;
}
