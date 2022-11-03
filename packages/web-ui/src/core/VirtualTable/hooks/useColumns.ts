import React from "react";
import {useDebounce} from "../../../hooks/useDebounce";
import {ArrayUtil} from "../../../internal/ArrayUtil";
import type {VirtualTableColumn, StickyPosition} from "../type";

interface Props<RowType extends object> {
    columns: VirtualTableColumn<RowType>[];
    scrollContentRef: React.RefObject<HTMLDivElement>;
    isScrollable: boolean;
}

export function useColumns<RowType extends object>({columns, scrollContentRef, isScrollable}: Props<RowType>) {
    const {columnWidths, headerRef, getColumnWidths} = useColumnWidths();
    const stickyPositionMap = useStickyPosition(columns, columnWidths);
    const {scrollBarSize, calculateScrollBarSize} = useScrollBar(scrollContentRef);

    const debouncedGetColumnWidths = useDebounce(getColumnWidths);
    const debouncedCalculateScrollBarSize = useDebounce(calculateScrollBarSize);

    const handler = React.useCallback(
        (event: TransitionEvent | AnimationEvent) => {
            if (event.currentTarget && "querySelector" in event.currentTarget && headerRef.current) {
                const element = event.currentTarget as HTMLElement;
                const result = element.querySelector(".g-virtual-table");
                if (result) {
                    debouncedGetColumnWidths();
                    debouncedCalculateScrollBarSize();
                }
            }
        },
        [headerRef, debouncedGetColumnWidths, debouncedCalculateScrollBarSize]
    );

    React.useEffect(() => {
        document.body.addEventListener("transitionend", handler);
        document.body.addEventListener("animationend", handler);
        return () => {
            document.body.removeEventListener("transitionend", handler);
            document.body.removeEventListener("animationend", handler);
        };
    }, [handler]);

    React.useEffect(() => {
        calculateScrollBarSize();
    }, [isScrollable, columnWidths, calculateScrollBarSize]);

    return {
        columnWidths,
        getColumnWidths,
        stickyPositionMap,
        scrollBarSize,
        headerRef,
    };
}

/**
 *
 * If the Virtual Table is render inside a container with open animation e.g. <Modal />,
 * the colWidths may be calculated during the transition and get the wrong width with useState & useEffect
 * useLayoutEffect will be trigged in the transition process and get the final correct column widths
 *
 */

export const useColumnWidths = () => {
    const headerRef = React.useRef<HTMLDivElement | null>(null);
    const [columnWidths, setColumnWidths] = React.useState<number[]>([]);

    const getColumnWidths = React.useCallback(() => {
        if (!headerRef.current) return;
        const headers = headerRef.current.querySelectorAll(".table-header");
        const widths: number[] = Array.prototype.slice.call(headers).map(header => {
            const {width} = header.getBoundingClientRect();
            return width;
        });
        setColumnWidths(widths);
    }, [headerRef]);

    return {columnWidths, getColumnWidths, headerRef};
};

export const useStickyPosition = <RowType extends object>(columns: VirtualTableColumn<RowType>[], columnWidths: number[]): Record<number, StickyPosition> => {
    return React.useMemo(() => {
        const stickyPositionMap: Record<number, StickyPosition> = {};
        const left: number[] = [];
        const right: number[] = [];

        const leftFixedCols = ArrayUtil.compactMap(columns, (_, columnIndex) => (_.fixed === "left" ? {columnIndex, width: columnWidths[columnIndex] || 0} : null));
        // the right sticky value stack in reverse direction
        const rightFixedCols = ArrayUtil.compactMap(columns, (_, columnIndex) => (_.fixed === "right" ? {columnIndex, width: columnWidths[columnIndex] || 0} : null)).reverse();

        leftFixedCols.forEach((column, idx) => {
            const stackedPositionValue = left.reduce((acc, prev) => acc + prev, 0);
            left.push(column.width);
            stickyPositionMap[column.columnIndex] = {value: stackedPositionValue, isLast: idx === leftFixedCols.length - 1};
        });

        rightFixedCols.forEach((column, idx) => {
            const stackedPositionValue = right.reduce((acc, prev) => acc + prev, 0);
            right.unshift(column.width);
            stickyPositionMap[column.columnIndex] = {value: stackedPositionValue, isLast: idx === rightFixedCols.length - 1};
        });

        return stickyPositionMap;
    }, [columnWidths, columns]);
};

export const useScrollBar = (scrollContentRef: React.RefObject<HTMLDivElement>) => {
    const [scrollBarSize, setScrollBarSize] = React.useState<number>(0);

    const calculateScrollBarSize = React.useCallback(() => {
        if (scrollContentRef.current) {
            const {clientWidth, offsetWidth} = scrollContentRef.current;
            setScrollBarSize(offsetWidth - clientWidth);
        }
    }, [scrollContentRef, setScrollBarSize]);

    return {
        scrollBarSize,
        calculateScrollBarSize,
    };
};
