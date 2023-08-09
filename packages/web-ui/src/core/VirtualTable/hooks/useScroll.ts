import React from "react";

export const useScrollable = (scrollContentRef: React.RefObject<HTMLDivElement>) => {
    const [scrollable, setScrollable] = React.useState({horizontal: false, vertical: false});

    const checkScrollable = React.useCallback(() => {
        if (scrollContentRef.current) {
            const {offsetWidth, clientWidth, offsetHeight, clientHeight} = scrollContentRef.current;
            setScrollable({vertical: offsetWidth !== clientWidth, horizontal: offsetHeight !== clientHeight});
        }
    }, [scrollContentRef]);

    return {scrollable, checkScrollable};
};

export const useSyncScroll = (scrollContentRef: React.RefObject<HTMLDivElement>, headerRef: React.RefObject<HTMLDivElement>) => {
    const onScroll = React.useCallback(() => {
        requestAnimationFrame(() => {
            if (scrollContentRef.current && headerRef.current && scrollContentRef.current.scrollLeft !== headerRef.current.scrollLeft) {
                headerRef.current.scrollLeft = scrollContentRef.current.scrollLeft;
            }
        });
    }, [scrollContentRef, headerRef]);

    return onScroll;
};

// for the box shadow transition of the fixed columns
export const useScrollToEdge = (scrollContentRef: React.RefObject<HTMLDivElement>) => {
    const checkIsScrollToEdge = React.useCallback(() => {
        if (scrollContentRef.current) {
            const {scrollLeft, scrollWidth, offsetWidth} = scrollContentRef.current;
            const isScrollToLeft = scrollLeft <= 1;
            const isScrollToRight = scrollLeft >= scrollWidth - offsetWidth;
            scrollContentRef.current.classList.toggle("scroll-to-left", isScrollToLeft);
            scrollContentRef.current.classList.toggle("scroll-to-right", isScrollToRight);
        }
    }, [scrollContentRef]);

    return checkIsScrollToEdge;
};
