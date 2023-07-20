import React from "react";
import {useForceUpdate} from "./useForceUpdate";

/**
 * delay value update when value meet condition `when`
 */
export function useDelayedWhen<T>(value: T, when: (value: T) => boolean, exceeded: number = 120): T {
    const forceUpdate = useForceUpdate();
    const idRef = React.useRef<number | undefined>(undefined);
    const delayedRef = React.useRef<T>(value);
    const previous = React.useRef(value);

    if (value !== previous.current) {
        window.clearTimeout(idRef.current);
        if (when(value)) {
            idRef.current = window.setTimeout(() => {
                idRef.current = undefined;
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

/**
 * Only set loading state to true when loading duration is longer than given ms,
 * in order to prevent loading ui flickering
 */
export function useDelayedLoading(value: boolean, exceeded: number = 120): boolean {
    return useDelayedWhen(value, _ => _ === true, exceeded);
}
