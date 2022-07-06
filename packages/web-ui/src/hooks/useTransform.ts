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
    x?: string | number;
    y?: string | number;
    z?: string | number;
    immediate?: boolean;
}

export const useTransform = (ref: React.RefObject<HTMLElement>, option?: Option) => {
    const initialOptionRef = React.useRef(option);
    initialOptionRef.current = option;

    const clearTransition = React.useCallback((el: HTMLElement) => {
        el.style.transitionDuration = "";
        el.style.transitionProperty = "";
        el.style.transitionTimingFunction = "";
        el.style.transitionDuration = "";
    }, []);

    const setTransition = React.useCallback(
        (el: HTMLElement, option?: Option) => {
            if (option) {
                const {delay, duration, property, timingFunction} = option;
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
                const format = (value?: number | string): string => (value ? (typeof value === "number" ? `${value}px` : value) : "0px");
                const el = ref.current;
                requestAnimationFrame(() => {
                    el.style.transform = `translate3d(${format(option.x)}, ${format(option.y)}, ${format(option.z)}) `;
                    option.immediate ? clearTransition(el) : setTransition(el, option);
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
                setTransition(el, initialOptionRef.current);
            });
        }
    }, [ref, setTransition]);

    React.useEffect(() => {
        if (initialOptionRef.current) {
            to(initialOptionRef.current);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps -- only run on mount
    }, []);

    return {to, clear};
};
