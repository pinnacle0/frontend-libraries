import React from "react";

interface TransitionOption {
    x?: number;
    y?: number;
    z?: number;
    immediate?: boolean;
}

export const useTransition = (ref: React.RefObject<HTMLElement>, initialOption?: TransitionOption) => {
    const initialOptionRef = React.useRef(initialOption);
    initialOptionRef.current = initialOption;

    const to = React.useCallback(
        (option: TransitionOption) => {
            if (ref.current) {
                const el = ref.current;
                requestAnimationFrame(() => {
                    el.style.transform = `translate3d(${option.x ?? 0}px, ${option.y ?? 0}px, ${option.z ?? 0}px) `;
                    option.immediate ? (el.style.transition = "none") : (el.style.transition = "");
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

    // TODO/Alvis: this can be wrong in fast refresh mode, need to improve
    React.useEffect(() => {
        if (initialOptionRef.current) {
            to(initialOptionRef.current);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps -- only run on mount
    }, []);

    return {to, clear};
};
