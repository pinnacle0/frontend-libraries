import React from "react";
import type {VirtualItem} from "react-virtual";
import type {ColumnFixedPosition, VirtualTableColumn} from "./type";
import type {StickyPosition} from "./useStickyPosition";

interface Props<RowType extends object> {
    dataSource: RowType[];
    transformedColumns: VirtualTableColumn<RowType>[];
    virtualItem: VirtualItem;
    columnWidths: number[];
    lastShownColumnIndex: number;
    scrollBarSize: number;
    stickyPosition: Record<number, StickyPosition>;
    getFixedColumnClassNames: (fixed: ColumnFixedPosition | undefined, columnIndex: number) => (string | undefined)[];
    rowClassName?: string;
    onRowClick?: (record: RowType, rowIndex: number) => number;
}

export const TableRow = Object.assign(
    function <RowType extends object>({
        virtualItem,
        getFixedColumnClassNames,
        dataSource,
        transformedColumns,
        columnWidths,
        scrollBarSize,
        stickyPosition,
        lastShownColumnIndex,
        rowClassName,
        onRowClick,
    }: Props<RowType>) {
        const rowIndex = virtualItem.index;
        const currentData = dataSource[rowIndex];
        return (
            <div
                key={rowIndex}
                className={["table-row", rowClassName, rowIndex % 2 ? "odd" : "even"].join(" ")}
                style={{height: virtualItem.size, transform: `translateY(${virtualItem.start}px)`}}
                onClick={() => onRowClick?.(currentData, rowIndex)}
            >
                {transformedColumns.map((column, columnIndex) => {
                    const colSpan = column.colSpan ? column.colSpan(currentData, rowIndex, columnIndex) : 1;
                    // handle colspan > 1
                    const cellWidth = colSpan > 1 ? columnWidths.slice(columnIndex, columnIndex + colSpan).reduce((acc, curr) => acc + curr, 0) : columnWidths[columnIndex] || column.width;

                    const renderData = column.display !== "hidden" && column.renderData(currentData, rowIndex);
                    // minus the scroll bar size of the last column & minus the scroll bar size in the right sticky value of the right fixed columns
                    const isLastShownColumn = lastShownColumnIndex === columnIndex;
                    const stickyPositionValue = stickyPosition[columnIndex]?.value || 0;

                    return (
                        renderData && (
                            <div
                                className={["table-cell", ...getFixedColumnClassNames(column.fixed, columnIndex)].join(" ")}
                                key={columnIndex}
                                style={{
                                    height: "100%",
                                    width: cellWidth - (isLastShownColumn ? scrollBarSize : 0),
                                    textAlign: column.align,
                                    left: column.fixed === "left" ? stickyPositionValue : undefined,
                                    right: column.fixed === "right" ? stickyPositionValue - (isLastShownColumn ? 0 : scrollBarSize) : undefined,
                                }}
                            >
                                {renderData}
                            </div>
                        )
                    );
                })}
            </div>
        );
    },
    {displayName: "TableRow"}
);
