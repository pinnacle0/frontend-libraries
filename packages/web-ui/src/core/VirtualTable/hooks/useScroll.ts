import React from "react";

interface Props {
    scrollContentRef: React.RefObject<HTMLDivElement>;
    headerRef: React.RefObject<HTMLDivElement>;
}

export const useScroll = ({scrollContentRef, headerRef}: Props) => {
    const checkIsScrollToEdge = useScrollToEdge(scrollContentRef);

    const onScroll = React.useCallback(() => {
        requestAnimationFrame(() => {
            if (scrollContentRef.current && headerRef.current && scrollContentRef.current.scrollLeft !== headerRef.current.scrollLeft) {
                headerRef.current.scrollLeft = scrollContentRef.current.scrollLeft;
                checkIsScrollToEdge();
            }
        });
    }, [scrollContentRef, headerRef, checkIsScrollToEdge]);

    const tableBodyRef = (node: HTMLDivElement) => {
        if (node) {
            checkIsScrollToEdge();
        }
    };

    return {
        onScroll,
        tableBodyRef,
    };
};

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
