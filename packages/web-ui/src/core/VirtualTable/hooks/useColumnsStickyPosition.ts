import React from "react";
import {ArrayUtil} from "../../../internal/ArrayUtil";
import type {VirtualTableColumn, ColumnsStickyPosition} from "../type";

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
