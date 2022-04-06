import React from "react";

export const useLoadingWithDelay = (loading: boolean, delay: number): Readonly<boolean> => {
    const [loadingWithDelay, setLoadingWithDelay] = React.useState(loading);
    const startTimeRef = React.useRef<number | null>(null);
    const setLoadingRef = React.useRef<(value: boolean) => void>(() => {});

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
        setLoadingRef.current(loading);
    }, [loading]);

    React.useEffect(() => {
        if (loadingWithDelay) {
            startTimeRef.current = Date.now();
        } else {
            startTimeRef.current = null;
        }
    }, [loadingWithDelay]);

    return loadingWithDelay;
};
