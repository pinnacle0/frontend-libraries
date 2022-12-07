import React from "react";
import {ReactUtil} from "../../util/ReactUtil";
import {classNames} from "../../util/ClassNames";
import type {VirtualItem} from "@tanstack/react-virtual";
import type {VirtualTableColumn, ColumnsStickyPosition} from "./type";

interface Props<RowType extends object> {
    data: RowType;
    columns: VirtualTableColumn<RowType>[];
    virtualItem: VirtualItem<HTMLDivElement>;
    columnWidths: number[];
    rowHeight: number;
    scrollBarSize: number;
    columnsStickyPosition: ColumnsStickyPosition;
    rowClassName?: string;
    onRowClick?: (record: RowType, rowIndex: number) => void;
}

export const TableRow = ReactUtil.memo("TableRow", function <
    RowType extends object
>({virtualItem, data, columns, columnWidths, rowHeight, scrollBarSize, columnsStickyPosition, rowClassName, onRowClick}: Props<RowType>) {
    const rowIndex = virtualItem.index;
    const lastShownColumnIndex: number = React.useMemo(() => columns.length - 1 - [...columns].reverse().findIndex(_ => _.display !== "hidden"), [columns]);

    return (
        <div
            key={rowIndex}
            className={classNames("table-row", rowClassName, rowIndex % 2 ? "odd" : "even")}
            style={{transform: `translateY(${virtualItem.start}px)`}}
            onClick={() => onRowClick?.(data, rowIndex)}
        >
            {columns.map((column, columnIndex) => {
                const colSpan = column.colSpan ? column.colSpan(data, rowIndex, columnIndex) : 1;
                // handle colspan > 1
                const cellWidth = colSpan > 1 ? columnWidths.slice(columnIndex, columnIndex + colSpan).reduce((acc, curr) => acc + curr, 0) : columnWidths[columnIndex] || column.width;

                const renderData = column.display !== "hidden" && column.renderData(data, rowIndex);
                // minus the scroll bar size of the last column & minus the scroll bar size in the right sticky value of the right fixed columns
                const isLastShownColumn = lastShownColumnIndex === columnIndex;
                const stickyPosition = columnsStickyPosition[columnIndex];

                return (
                    renderData && (
                        <div
                            className={classNames("table-cell", {fixed: column.fixed, left: column.fixed === "left", right: column.fixed === "right", last: stickyPosition?.isLast})}
                            key={columnIndex}
                            style={{
                                height: rowHeight,
                                width: cellWidth - (isLastShownColumn ? scrollBarSize : 0),
                                textAlign: column.align,
                                left: column.fixed === "left" ? stickyPosition?.value : undefined,
                                right: column.fixed === "right" ? stickyPosition?.value - (isLastShownColumn ? 0 : scrollBarSize) : undefined,
                            }}
                        >
                            {renderData}
                        </div>
                    )
                );
            })}
        </div>
    );
});
