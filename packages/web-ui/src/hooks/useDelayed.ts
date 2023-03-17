import React from "react";

/**
 * delay value update when value meet condition `when`
 */
export function useDelayedWhen<T>(value: T, when: (value: T) => boolean, exceeded: number = 120): T {
    const [delayed, setDelayed] = React.useState(value);

    const whenRef = React.useRef(when);
    whenRef.current = when;

    const exceededRef = React.useRef(exceeded);
    exceededRef.current = exceeded;

    React.useEffect(() => {
        if (whenRef.current(value)) {
            const id = window.setTimeout(() => setDelayed(value), exceededRef.current);
            return () => window.clearTimeout(id);
        } else {
            setDelayed(value);
        }
    }, [value]);

    return delayed;
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
