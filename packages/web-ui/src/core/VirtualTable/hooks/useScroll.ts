import React from "react";

interface Props {
    scrollContentRef: React.RefObject<HTMLDivElement>;
    headerRef: React.RefObject<HTMLDivElement>;
    totalSize: number;
}

export const useScroll = ({scrollContentRef, headerRef, totalSize}: Props) => {
    const checkIsScrollToEdge = useScrollToEdge(scrollContentRef);
    const {scrollBarSize} = useScrollBarSize(scrollContentRef, totalSize);

    const onScroll = React.useCallback(() => {
        requestAnimationFrame(() => {
            if (scrollContentRef.current && headerRef.current && scrollContentRef.current.scrollLeft !== headerRef.current.scrollLeft) {
                headerRef.current.scrollLeft = scrollContentRef.current.scrollLeft;
                checkIsScrollToEdge();
            }
        });
    }, [scrollContentRef, headerRef, checkIsScrollToEdge]);

    const tableBodyRef = React.useCallback((node: HTMLDivElement) => node && checkIsScrollToEdge(), [checkIsScrollToEdge]);

    return {
        onScroll,
        tableBodyRef,
        scrollBarSize,
    };
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

export const useScrollBarSize = (scrollContentRef: React.RefObject<HTMLDivElement>, totalSize: number) => {
    const [scrollBarSize, setScrollBarSize] = React.useState<number>(0);

    const calculateScrollBarSize = React.useCallback(() => {
        if (scrollContentRef.current) {
            const {clientWidth, offsetWidth} = scrollContentRef.current;
            setScrollBarSize(offsetWidth - clientWidth);
        }
    }, [scrollContentRef, setScrollBarSize]);

    React.useEffect(() => {
        calculateScrollBarSize();
    }, [calculateScrollBarSize, totalSize]);

    return {
        scrollBarSize,
    };
};
