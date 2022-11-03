import React from "react";
import {ArrayUtil} from "../../../internal/ArrayUtil";
import type {VirtualTableColumn, StickyPosition} from "../type";

interface Props<RowType extends object> {
    columns: VirtualTableColumn<RowType>[];
    headerRef: React.RefObject<HTMLDivElement>;
    scrollContentRef: React.RefObject<HTMLDivElement>;
    isScrollable: boolean;
}

export function useColumns<RowType extends object>({columns, headerRef, scrollContentRef, isScrollable}: Props<RowType>) {
    const {columnWidths, isColumnWidthsReady, getColumnWidths} = useColumnWidths(headerRef);
    const stickyPositionMap = useStickyPosition(columns, isColumnWidthsReady ? columnWidths.current : []);
    const scrollBarSize = useScrollBar(scrollContentRef, isColumnWidthsReady, isScrollable);

    return {
        isReady: isColumnWidthsReady,
        columnWidths,
        getColumnWidths,
        stickyPositionMap,
        scrollBarSize,
    };
}

/**
 *
 * If the Virtual Table is render inside a container with open animation e.g. <Modal />,
 * the colWidths may be calculated during the transition and get the wrong width with useState & useEffect
 * useLayoutEffect will be trigged in the transition process and get the final correct column widths
 *
 */

export const useColumnWidths = (headerRef: React.RefObject<HTMLDivElement>) => {
    const [isColumnWidthsReady, setIsColumnWidthsReady] = React.useState(false);
    const columnWidths = React.useRef<number[]>([]);

    const getColumnWidths = React.useCallback(() => {
        if (headerRef.current) {
            setIsColumnWidthsReady(false);
            const headers = headerRef.current.querySelectorAll(".table-header");
            columnWidths.current = Array.prototype.slice.call(headers).map(header => {
                const {width} = header.getBoundingClientRect();
                return width;
            });
            setIsColumnWidthsReady(true);
        }
    }, [headerRef]);

    return {columnWidths, isColumnWidthsReady, getColumnWidths};
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

export const useScrollBar = (scrollContentRef: React.RefObject<HTMLDivElement>, isReady: boolean, isScrollable: boolean) => {
    const [scrollBarSize, setScrollBarSize] = React.useState<number>(0);

    const calculateScrollBarSize = React.useCallback(() => {
        if (scrollContentRef.current) {
            const {clientWidth, offsetWidth} = scrollContentRef.current;
            setScrollBarSize(offsetWidth - clientWidth);
        }
    }, [scrollContentRef, setScrollBarSize]);

    React.useEffect(() => {
        if (isReady) {
            calculateScrollBarSize();
        }
    }, [isScrollable, isReady, calculateScrollBarSize]);

    return scrollBarSize;
};
