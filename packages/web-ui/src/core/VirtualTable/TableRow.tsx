import React from "react";
import type {VirtualItem} from "react-virtual";
import type {ColumnFixedPosition, VirtualTableColumn, VirtualTableRowExpand, StickyPosition} from "./type";

interface Props<RowType extends object> {
    data: RowType;
    columns: VirtualTableColumn<RowType>[];
    virtualItem: VirtualItem;
    columnWidths: number[];
    rowHeight: number;
    lastShownColumnIndex: number;
    scrollBarSize: number;
    stickyPosition: Record<number, StickyPosition>;
    getFixedColumnClassNames: (fixed: ColumnFixedPosition | undefined, columnIndex: number) => (string | undefined)[];
    rowClassName?: string;
    onRowClick?: (record: RowType, rowIndex: number) => number;
    rowExpand?: VirtualTableRowExpand<RowType>;
}

export const TableRow = Object.assign(
    function <RowType extends object>({
        virtualItem,
        getFixedColumnClassNames,
        data,
        columns,
        columnWidths,
        rowHeight,
        scrollBarSize,
        stickyPosition,
        lastShownColumnIndex,
        rowClassName,
        onRowClick,
        rowExpand,
    }: Props<RowType>) {
        const rowRef = React.useRef<HTMLDivElement>(null);
        const [isExpanded, setIsExpanded] = React.useState(rowExpand?.isDefaultExpanded || false);
        const rowIndex = virtualItem.index;

        const toggleExpendRow = React.useCallback(() => setIsExpanded(!isExpanded), [isExpanded]);

        React.useEffect(() => {
            if (rowRef.current) {
                virtualItem.measureRef(rowRef.current);
            }
        }, [isExpanded, virtualItem]);

        return (
            <div
                ref={rowRef}
                key={rowIndex}
                className={["table-row", rowClassName, rowIndex % 2 ? "odd" : "even"].join(" ")}
                style={{transform: `translateY(${virtualItem.start}px)`}}
                onClick={() => onRowClick?.(data, rowIndex)}
            >
                {columns.map((column, columnIndex) => {
                    const colSpan = column.colSpan ? column.colSpan(data, rowIndex, columnIndex) : 1;
                    // handle colspan > 1
                    const cellWidth = colSpan > 1 ? columnWidths.slice(columnIndex, columnIndex + colSpan).reduce((acc, curr) => acc + curr, 0) : columnWidths[columnIndex] || column.width;

                    const renderData =
                        column.display !== "hidden" && (rowExpand && columnIndex === columns.length - 1 ? <rowExpand.ExpandButton onClick={toggleExpendRow} /> : column.renderData(data, rowIndex));
                    // minus the scroll bar size of the last column & minus the scroll bar size in the right sticky value of the right fixed columns
                    const isLastShownColumn = lastShownColumnIndex === columnIndex;
                    const stickyPositionValue = stickyPosition[columnIndex]?.value || 0;

                    return (
                        renderData && (
                            <div
                                className={["table-cell", ...getFixedColumnClassNames(column.fixed, columnIndex)].join(" ")}
                                key={columnIndex}
                                style={{
                                    height: rowHeight,
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
                {rowExpand && <div className={`expand-row ${isExpanded ? "expanded" : ""}`}>{rowExpand.renderExpandRow(data, rowIndex)}</div>}
            </div>
        );
    },
    {displayName: "TableRow"}
);
