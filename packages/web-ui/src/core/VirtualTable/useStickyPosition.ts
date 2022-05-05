import React from "react";
import {ArrayUtil} from "../../internal/ArrayUtil";
import type {VirtualTableColumn} from "./type";

export interface StickyPosition {
    value: number;
    isLast: boolean;
}

export const useStickyPosition = <RowType extends object>(transformedColumns: VirtualTableColumn<RowType>[], columnWidths: number[]): Record<number, StickyPosition> => {
    return React.useMemo(() => {
        const result: Record<number, StickyPosition> = {};
        const left: number[] = [];
        const right: number[] = [];

        const leftFixedCols = ArrayUtil.compactMap(transformedColumns, (_, columnIndex) => (_.fixed === "left" ? {columnIndex, width: columnWidths[columnIndex]} : null));
        // the right sticky value stack in reverse direction
        const rightFixedCols = ArrayUtil.compactMap(transformedColumns, (_, columnIndex) => (_.fixed === "right" ? {columnIndex, width: columnWidths[columnIndex]} : null)).reverse();

        leftFixedCols.forEach((column, idx) => {
            const stackedPositionValue = left.reduce((acc, prev) => acc + prev, 0);
            left.push(column.width);
            result[column.columnIndex] = {value: stackedPositionValue, isLast: idx === leftFixedCols.length - 1};
        });

        rightFixedCols.forEach((column, idx) => {
            const stackedPositionValue = right.reduce((acc, prev) => acc + prev, 0);
            right.unshift(column.width);
            result[column.columnIndex] = {value: stackedPositionValue, isLast: idx === rightFixedCols.length - 1};
        });

        return result;
    }, [columnWidths, transformedColumns]);
};
