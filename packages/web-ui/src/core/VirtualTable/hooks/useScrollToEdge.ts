import React, {useEffect} from "react";

export const useScrollToEdge = (scrollContentRef: React.RefObject<HTMLElement>) => {
    const [isScrollToLeft, setIsScrollToLeft] = React.useState(false);
    const [isScrollToRight, setIsScrollToRight] = React.useState(false);
    const [isScrollToTop, setIsScrollToTop] = React.useState(false);
    const [isScrollToBottom, setIsScrollToBottom] = React.useState(false);

    const isScrollToEdge = React.useCallback(() => {
        if (scrollContentRef.current) {
            const {scrollLeft, scrollWidth, clientWidth, scrollTop, scrollHeight, clientHeight} = scrollContentRef.current;
            const isScrollLeft = scrollLeft <= 1;
            const isScrollRight = scrollLeft >= scrollWidth - clientWidth;

            const isScrollTop = scrollTop <= 1;
            const isScrollBottom = scrollTop >= scrollHeight - clientHeight;
            setIsScrollToLeft(isScrollLeft);
            setIsScrollToRight(isScrollRight);
            setIsScrollToTop(isScrollTop);
            setIsScrollToBottom(isScrollBottom);
        }
    }, [scrollContentRef]);

    // initialize
    useEffect(() => {
        isScrollToEdge();
    }, [isScrollToEdge]);

    return {
        isScrollToEdge,
        isScrollToLeft,
        isScrollToRight,
        isScrollToTop,
        isScrollToBottom,
    };
};
