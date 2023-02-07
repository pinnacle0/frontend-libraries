import React from "react";
import {useDebounce} from "../../../hooks/useDebounce";
import {ArrayUtil} from "../../../internal/ArrayUtil";
import type {VirtualTableColumn, ColumnsStickyPosition} from "../type";

interface Props<RowType extends object> {
    columns: VirtualTableColumn<RowType>[];
}

/**
 *
 * VirtualTable is not crated by <table>, the header cell width cannot auto align the body cell width which has large content.
 * So VirtualTable get the columns widths by following steps:
 * 1. Only render the headers with flex style
 * 2. Get the widths of the table headers in ref
 * 3. Calculate the sticky position of the fixed column/header if exists
 * 4. Render the table body columns with the headers widths gotten in step 2
 *
 */

export function useColumns<RowType extends object>({columns}: Props<RowType>) {
    const {columnWidths, headerRef, getColumnWidths} = useColumnWidths();
    const columnsStickyPosition = useColumnsStickyPosition(columns, columnWidths);
    const debouncedGetColumnWidths = useDebounce(getColumnWidths, 100);

    const handler = React.useCallback(
        (event: TransitionEvent | AnimationEvent) => {
            if (event.currentTarget && "querySelector" in event.currentTarget && headerRef.current) {
                const element = event.currentTarget as HTMLElement;
                const result = element.querySelector(".g-virtual-table");
                if (result) {
                    debouncedGetColumnWidths();
                }
            }
        },
        [headerRef, debouncedGetColumnWidths]
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
        getColumnWidths,
        columnsStickyPosition,
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

export const useColumnsStickyPosition = <RowType extends object>(columns: VirtualTableColumn<RowType>[], columnWidths: number[]): ColumnsStickyPosition => {
    return React.useMemo(() => {
        const columnsStickyPosition: ColumnsStickyPosition = {};
        let leftColumnsStackPositionValue = 0;
        let rightColumnsStackPositionValue = 0;

        const leftFixedCols = ArrayUtil.compactMap(columns, (_, columnIndex) => (_.fixed === "left" ? {columnIndex, width: columnWidths[columnIndex] || 0} : null));
        // the right sticky value stack in reverse direction
        const rightFixedCols = ArrayUtil.compactMap(columns, (_, columnIndex) => (_.fixed === "right" ? {columnIndex, width: columnWidths[columnIndex] || 0} : null)).reverse();

        leftFixedCols.forEach((column, idx) => {
            columnsStickyPosition[column.columnIndex] = {value: leftColumnsStackPositionValue, isLast: idx === leftFixedCols.length - 1};
            leftColumnsStackPositionValue += column.width;
        });

        rightFixedCols.forEach((column, idx) => {
            columnsStickyPosition[column.columnIndex] = {value: rightColumnsStackPositionValue, isLast: idx === rightFixedCols.length - 1};
            rightColumnsStackPositionValue += column.width;
        });

        return columnsStickyPosition;
    }, [columnWidths, columns]);
};
