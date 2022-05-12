import React from "react";

/**
 * This hook prevent loading state causing ui to flash
 * For instance, in real life loading only last for 50ms, so it make loading ui appear in a blink of an eye, which is not good
 * Hook will only delay the loading state change from true to false, it force loading ui at least appear for a period of time
 * @param loading
 * @param delay
 * @returns
 */
export const useLoadingWithDelay = (loading: boolean, delay: number): Readonly<boolean> => {
    const [loadingWithDelay, setLoadingWithDelay] = React.useState(loading);
    const startTimeRef = React.useRef<number | null>(null);
    const setLoadingRef = React.useRef<(value: boolean) => void>();

    const setLoading = React.useCallback(
        (value: boolean) => {
            if (value) {
                setLoadingWithDelay(true);
                startTimeRef.current = Date.now();
                setTimeout(() => (startTimeRef.current = null), delay);
            } else {
                if (startTimeRef.current) {
                    setTimeout(() => setLoadingWithDelay(false), Math.abs(delay - (Date.now() - startTimeRef.current)));
                } else {
                    setLoadingWithDelay(value);
                }
            }
        },
        [delay]
    );

    setLoadingRef.current = setLoading;

    React.useEffect(() => {
        setLoadingRef.current?.(loading);
    }, [loading]);

    return loadingWithDelay;
};
