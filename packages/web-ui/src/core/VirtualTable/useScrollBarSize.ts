import React from "react";

export const useScrollBarSize = (scrollContentRef: React.RefObject<HTMLDivElement>, isScrollable: boolean): number => {
    const [scrollBarSize, setScrollBarSize] = React.useState<number>(0);

    const calculateScrollBarSize = React.useCallback(() => {
        if (scrollContentRef.current) {
            const {clientWidth, offsetWidth} = scrollContentRef.current;
            setScrollBarSize(offsetWidth - clientWidth);
        }
    }, [scrollContentRef, setScrollBarSize]);

    React.useEffect(() => {
        if (isScrollable && !scrollBarSize) {
            calculateScrollBarSize();
        }
    }, [calculateScrollBarSize, isScrollable, scrollBarSize]);

    return scrollBarSize;
};
