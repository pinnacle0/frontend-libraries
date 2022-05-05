import React from "react";

// need to cache scrollable results

// only change when window resize, data change, and css change

export const useElementScrollState = (ref: React.RefObject<HTMLElement | null>) => {
    const isScrollTop = React.useCallback(() => ref.current?.scrollTop === 0, [ref]);
    const isScrollBottom = React.useCallback(() => {
        const element = ref.current;
        if (element) {
            const {scrollHeight, scrollTop, clientHeight} = element;
            return Math.ceil(scrollTop) + clientHeight >= scrollHeight;
        } else {
            return false;
        }
    }, [ref]);

    const isScrollLeft = React.useCallback(() => ref.current?.scrollLeft === 0, [ref]);
    const isScrollRight = React.useCallback(() => {
        const element = ref.current;
        if (element) {
            const {scrollWidth, scrollLeft, clientWidth} = element;
            return Math.ceil(scrollLeft) + clientWidth >= scrollWidth;
        } else {
            return false;
        }
    }, [ref]);

    return {isScrollTop, isScrollBottom, isScrollLeft, isScrollRight};
};
