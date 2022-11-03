import React from "react";

interface Props {
    scrollContentRef: React.RefObject<HTMLDivElement>;
    headerRef: React.RefObject<HTMLDivElement>;
}

export const useScroll = ({scrollContentRef, headerRef}: Props) => {
    const tableBodyRef = (node: HTMLDivElement) => {
        if (node) {
            checkIsScrollToEdge();
        }
    };
    const {isScrollToLeft, isScrollToRight, checkIsScrollToEdge} = useScrollToEdge(scrollContentRef);
    const onScroll = React.useCallback(() => {
        requestAnimationFrame(() => {
            if (scrollContentRef.current && headerRef.current && scrollContentRef.current.scrollLeft !== headerRef.current.scrollLeft) {
                headerRef.current.scrollLeft = scrollContentRef.current.scrollLeft;
                checkIsScrollToEdge();
            }
        });
    }, [scrollContentRef, headerRef, checkIsScrollToEdge]);

    return {
        onScroll,
        isScrollToLeft,
        isScrollToRight,
        tableBodyRef,
    };
};

export const useScrollToEdge = (scrollContentRef: React.RefObject<HTMLDivElement>) => {
    const [isScrollToLeft, setIsScrollToLeft] = React.useState(false);
    const [isScrollToRight, setIsScrollToRight] = React.useState(false);

    const checkIsScrollToEdge = React.useCallback(() => {
        if (scrollContentRef.current) {
            const {scrollLeft, scrollWidth, offsetWidth} = scrollContentRef.current;
            setIsScrollToLeft(scrollLeft <= 1);
            setIsScrollToRight(scrollLeft >= scrollWidth - offsetWidth);
        }
    }, [scrollContentRef]);

    return {
        isScrollToLeft,
        isScrollToRight,
        checkIsScrollToEdge,
    };
};
