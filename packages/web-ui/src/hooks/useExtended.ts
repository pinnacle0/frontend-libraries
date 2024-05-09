import React from "react";
import {useForceUpdate} from "./useForceUpdate";

export function useExtendedWhen<T>(value: T, when: (value: T) => boolean, minDuration: number) {
    const forceUpdate = useForceUpdate();
    const extendedRef = React.useRef<T>(value);
    const lastValueUpdateTimeRef = React.useRef(0);

    const elapsed = Date.now() - lastValueUpdateTimeRef.current;

    if (lastValueUpdateTimeRef.current > 0 && elapsed < minDuration) {
        window.setTimeout(() => {
            extendedRef.current = value;
            lastValueUpdateTimeRef.current = 0;
            forceUpdate();
        }, minDuration - elapsed);
    } else {
        if (lastValueUpdateTimeRef.current === 0 && when(value)) {
            lastValueUpdateTimeRef.current = Date.now();
            extendedRef.current = value;
        }
    }

    return extendedRef.current;
}

export function useExtended<T>(value: T, minDuration: number) {
    return useExtendedWhen(value, () => true, minDuration);
}
