import React from "react";
import {useDebounce} from "./useDebounce";
import {useScrollBarSize} from "./useScrollBarSize";
import {useColumnWidths} from "./useColumnWidths";
import {useStickyPosition} from "./useStickyPosition";
import {useScrollToEdge} from "./useScrollToEdge";
import type {VirtualTableColumn} from "../type";

interface Props<RowType extends object> {
    headersRef: React.RefObject<HTMLDivElement>;
    scrollContentRef: React.RefObject<HTMLDivElement>;
    isScrollable: boolean;
    columns: VirtualTableColumn<RowType>[];
}

export const useLayout = function <RowType extends object>({headersRef, scrollContentRef, isScrollable, columns}: Props<RowType>) {
    const {calculateColWidths, columnWidths} = useColumnWidths(headersRef);
    const {calculateScrollBarSize, scrollBarSize} = useScrollBarSize(scrollContentRef, isScrollable);
    const {isScrollToEdge, isScrollToLeft, isScrollToRight} = useScrollToEdge(scrollContentRef);
    const stickyPosition = useStickyPosition(columns, columnWidths);

    const debouncedCalculateColWidths = useDebounce(calculateColWidths);
    const debouncedCalculateScrollBarSize = useDebounce(calculateScrollBarSize);
    const debouncedIsScrollToEdge = useDebounce(isScrollToEdge);

    const handler = React.useCallback(
        (event: TransitionEvent | AnimationEvent) => {
            if (event.currentTarget && "querySelector" in event.currentTarget && headersRef.current) {
                const element = event.currentTarget as HTMLElement;
                const result = element.querySelector(".g-virtual-table");
                if (result) {
                    debouncedCalculateColWidths();
                    debouncedCalculateScrollBarSize();
                    debouncedIsScrollToEdge();
                }
            }
        },
        [debouncedCalculateColWidths, debouncedCalculateScrollBarSize, headersRef, debouncedIsScrollToEdge]
    );

    React.useEffect(() => {
        document.body.addEventListener("transitionend", handler);
        document.body.addEventListener("animationend", handler);
        return () => {
            document.body.removeEventListener("transitionend", handler);
            document.body.removeEventListener("animationend", handler);
        };
    }, [handler]);

    return {
        columnWidths,
        scrollBarSize,
        stickyPosition,
        isScrollToEdge,
        isScrollToLeft,
        isScrollToRight,
    };
};
