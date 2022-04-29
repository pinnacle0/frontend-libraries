import React from "react";

interface TransitionOption {
    // transition related properties
    property?: string;
    // in ms
    duration?: number;
    delay?: number;
    timingFunction?: string;
}

interface Option extends TransitionOption {
    // transform related properties
    x?: number;
    y?: number;
    z?: number;
    immediate?: boolean;
}

export const useTransform = (ref: React.RefObject<HTMLElement>, option?: Option) => {
    const optionRef = React.useRef(option);
    optionRef.current = option;

    const clearTransition = React.useCallback((el: HTMLElement) => {
        el.style.transitionDuration = "";
        el.style.transitionProperty = "";
        el.style.transitionTimingFunction = "";
        el.style.transitionDuration = "";
    }, []);

    const setTransition = React.useCallback(
        (el: HTMLElement) => {
            if (optionRef.current) {
                const {delay, duration, property, timingFunction} = optionRef.current;
                delay && (el.style.transitionDelay = delay + "ms");
                duration && (el.style.transitionDuration = duration + "ms");
                property && (el.style.transitionProperty = property);
                timingFunction && (el.style.transitionTimingFunction = timingFunction);
            } else {
                clearTransition(el);
            }
        },
        [clearTransition]
    );

    const to = React.useCallback(
        (option: Option) => {
            if (ref.current) {
                const el = ref.current;
                requestAnimationFrame(() => {
                    el.style.transform = `translate3d(${option.x ?? 0}px, ${option.y ?? 0}px, ${option.z ?? 0}px) `;
                    option.immediate ? clearTransition(el) : setTransition(el);
                });
            }
        },
        [ref, setTransition, clearTransition]
    );

    const clear = React.useCallback(() => {
        if (ref.current) {
            const el = ref.current;
            requestAnimationFrame(() => {
                el.style.transform = "";
                setTransition(el);
            });
        }
    }, [ref, setTransition]);

    React.useEffect(() => {
        if (optionRef.current) {
            to(optionRef.current);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps -- only run on mount
    }, []);

    return {to, clear};
};
