import React from "react";

export const useTransition = (ref: React.RefObject<HTMLElement>) => {
    const transit = React.useCallback(
        (x: number, y: number) => {
            if (ref.current) {
                const el = ref.current;
                requestAnimationFrame(() => {
                    el.style.transform = `translate3d(${x}px, ${y}px, 0px)`;
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
            });
        }
    }, [ref]);

    return {transit, clear};
};
