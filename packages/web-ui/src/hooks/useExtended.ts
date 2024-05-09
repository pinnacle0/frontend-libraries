import React from "react";
import {useForceUpdate} from "./useForceUpdate";

export function useExtendedWhen<T>(value: T, when: (value: T) => boolean, minDuration: number) {
    const forceUpdate = useForceUpdate();
    const currentValueRef = React.useRef<T>(value);
    const extendedValueRef = React.useRef<T>(value);
    const lastValueUpdateTimeRef = React.useRef(0);
    const timerRef = React.useRef<number | null>(null);

    currentValueRef.current = value;

    if (timerRef.current === null) {
        const elapsed = Date.now() - lastValueUpdateTimeRef.current;
        if (lastValueUpdateTimeRef.current > 0 && elapsed < minDuration) {
            timerRef.current = window.setTimeout(() => {
                extendedValueRef.current = currentValueRef.current;
                lastValueUpdateTimeRef.current = 0;
                timerRef.current = null;
                forceUpdate();
            }, minDuration - elapsed);
        } else {
            if (when(value)) {
                lastValueUpdateTimeRef.current = Date.now();
            }
            extendedValueRef.current = value;
        }
    }
    return extendedValueRef.current;
}

export function useExtended<T>(value: T, minDuration: number) {
    return useExtendedWhen(value, () => true, minDuration);
}
