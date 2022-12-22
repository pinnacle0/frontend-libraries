import React from "react";

/**
 * Prevent flickering refreshing
 * `PS`: This is totally different from prevent flickering loading, the hook make sure refreshing must remain `true` in a certain period of time
 */
export function useRefreshing(refreshing: boolean, duration: number): boolean {
    const [guarantee, setGuarantee] = React.useState(refreshing);
    const timerId = React.useRef<number>();
    const lastLoadingTime = React.useRef<number>(Date.now());

    const durationRef = React.useRef(duration);
    durationRef.current = duration;

    React.useEffect(() => {
        if (refreshing) {
            lastLoadingTime.current = Date.now();
            clearTimeout(timerId.current);
            setGuarantee(true);
        } else {
            const remain = durationRef.current - (Date.now() - lastLoadingTime.current);
            if (remain > 0) {
                timerId.current = window.setTimeout(() => setGuarantee(false), remain);
            } else {
                setGuarantee(false);
            }
        }
    }, [refreshing]);

    return guarantee;
}
