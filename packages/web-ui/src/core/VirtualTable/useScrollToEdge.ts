import React, {useEffect} from "react";

export const useScrollToEdge = (scrollContentRef: React.RefObject<HTMLElement>) => {
    const [isScrollToLeft, setIsScrollToLeft] = React.useState(false);
    const [isScrollToRight, setIsScrollToRight] = React.useState(false);
    const [isScrollToTop, setIsScrollToTop] = React.useState(false);
    const [isScrollToBottom, setIsScrollToBottom] = React.useState(false);

    const isScrollToEdge = React.useCallback(() => {
        const isScrollLeft = scrollContentRef.current ? scrollContentRef.current.scrollLeft <= 1 : false;
        const isScrollRight = scrollContentRef.current ? scrollContentRef.current.scrollLeft >= scrollContentRef.current.scrollWidth - scrollContentRef.current.clientWidth : false;

        const isScrollTop = scrollContentRef.current ? scrollContentRef.current.scrollTop <= 1 : false;
        const isScrollBottom = scrollContentRef.current ? scrollContentRef.current.scrollTop >= scrollContentRef.current.scrollHeight - scrollContentRef.current.clientHeight : false;
        setIsScrollToLeft(isScrollLeft);
        setIsScrollToRight(isScrollRight);
        setIsScrollToTop(isScrollTop);
        setIsScrollToBottom(isScrollBottom);
    }, [scrollContentRef]);

    // initialize
    useEffect(() => {
        isScrollToEdge();
    }, [isScrollToEdge]);

    return {
        onScroll: isScrollToEdge,
        isScrollToLeft,
        isScrollToRight,
        isScrollToTop,
        isScrollToBottom,
    };
};
