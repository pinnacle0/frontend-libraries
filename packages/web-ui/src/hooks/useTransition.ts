import React from "react";

interface TransitionOptions {
    x?: number;
    y?: number;
    z?: number;
    immediate?: boolean;
}

export const useTransition = (ref: React.RefObject<HTMLElement>) => {
    const transit = React.useCallback(
        (options: TransitionOptions) => {
            if (ref.current) {
                const el = ref.current;
                requestAnimationFrame(() => {
                    el.style.transform = `translate3d(${options.x ?? 0}px, ${options.y ?? 0}px, ${options.z ?? 0}px)`;
                    if (options.immediate) {
                        el.style.transition = "none";
                    } else {
                        el.style.transition = "";
                    }
                });
            }
        },
        [ref]
    );

    const clear = React.useCallback(() => {
        if (ref.current) {
            const el = ref.current;
            requestAnimationFrame(() => {
                el.style.transform = "";
                el.style.transition = "";
            });
        }
    }, [ref]);

    return {transit, clear};
};
