import React from "react";

export const useScrollToEdge = (scrollContentRef: React.RefObject<HTMLElement>) => {
    const [isScrollToLeft, setIsScrollToLeft] = React.useState(true);
    const [isScrollToRight, setIsScrollToRight] = React.useState(false);
    const [isScrollToTop, setIsScrollToTop] = React.useState(true);
    const [isScrollToBottom, setIsScrollToBottom] = React.useState(false);

    const onScroll = React.useCallback(() => {
        const isScrollLeft = scrollContentRef.current ? scrollContentRef.current.scrollLeft <= 1 : false;
        const isScrollRight = scrollContentRef.current ? scrollContentRef.current.scrollLeft >= scrollContentRef.current.scrollWidth - scrollContentRef.current.clientWidth : false;

        const isScrollTop = scrollContentRef.current ? scrollContentRef.current.scrollTop <= 1 : false;
        const isScrollBottom = scrollContentRef.current ? scrollContentRef.current.scrollTop >= scrollContentRef.current.scrollHeight - scrollContentRef.current.clientHeight : false;
        setIsScrollToLeft(isScrollLeft);
        setIsScrollToRight(isScrollRight);
        setIsScrollToTop(isScrollTop);
        setIsScrollToBottom(isScrollBottom);
    }, [scrollContentRef]);

    return {
        onScroll,
        isScrollToLeft,
        isScrollToRight,
        isScrollToTop,
        isScrollToBottom,
    };
};
