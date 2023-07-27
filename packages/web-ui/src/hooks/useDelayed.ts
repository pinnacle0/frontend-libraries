import React from "react";
import {useForceUpdate} from "./useForceUpdate";

/**
 * delay value update when value meet condition `when`
 */
export function useDelayedWhen<T>(value: T, when: (value: T) => boolean, exceeded: number = 120): T {
    const forceUpdate = useForceUpdate();
    const timerRef = React.useRef<number | undefined>(undefined);
    const delayedRef = React.useRef(value);
    const previous = React.useRef(value);

    if (value !== previous.current) {
        window.clearTimeout(timerRef.current);
        if (when(value)) {
            timerRef.current = window.setTimeout(() => {
                timerRef.current = undefined;
                delayedRef.current = value;
                forceUpdate();
            }, exceeded);
        } else {
            delayedRef.current = value;
        }
    }

    previous.current = value;
    return delayedRef.current;
}

export function useDelayed<T>(value: T, exceeded: number): T {
    return useDelayedWhen<T>(value, () => true, exceeded);
}
