import React from "react";
import {useVirtual} from "react-virtual";
import {ArrayUtil} from "../../internal/ArrayUtil";
import {Spin} from "../Spin";
import {useRowSelection} from "./useRowSelection";
import {useScrollToEdge} from "./useScrollToEdge";
import type {SafeReactChildren, SafeReactChild, StringKey} from "../../internal/type";
import "./index.less";

interface StickyPosition {
    value: number;
    isLast: boolean;
}

export type VirtualTableRowSelection<RowType extends object> = {
    width: number;
    selectedRowKeys: React.Key[];
    onChange: (selectedRowKeys: React.Key[], selectedRows: RowType[]) => void;
    fixed?: boolean; // can only sticky in left
    disableSelection?: (data: RowType, rowIndex: number) => boolean;
    disableSelectAll?: boolean;
    title?: React.ReactElement | React.ReactChild;
};

export type VirtualTableColumn<RowType extends object> = {
    title: React.ReactElement | React.ReactChild;
    width: number;
    renderData: (record: RowType, rowIndex: number) => SafeReactChildren | undefined;
    align?: "left" | "right" | "center";
    display?: "default" | "hidden";
    fixed?: "left" | "right";
    colSpan?: (record: RowType, rowIndex: number, colIndex: number) => number;
};

export interface VirtualTableProps<RowType extends object> {
    dataSource: RowType[];
    columns: VirtualTableColumn<RowType>[];
    scrollY: number;
    rowHeight: number | ((rowIndex: number) => number);
    className?: string;
    rowClassName?: string;
    scrollX?: number;
    loading?: boolean;
    emptyPlaceholder?: SafeReactChild;
    rowSelection?: VirtualTableRowSelection<RowType>;
    /**
     * Default: index
     */
    rowKey?: StringKey<RowType> | "index";
}

const headerHeight = 50;
const scrollBarSize = 10;

export const VirtualTable = Object.assign(
    function <RowType extends object>({
        columns,
        rowHeight,
        scrollY,
        dataSource,
        className,
        rowClassName,
        loading,
        emptyPlaceholder,
        rowSelection,
        scrollX,
        rowKey = "index",
    }: VirtualTableProps<RowType>) {
        const size = dataSource.length;
        const scrollContentRef = React.useRef<HTMLDivElement>(null);
        const estimateSize = React.useCallback((rowIndex: number) => (typeof rowHeight === "function" ? rowHeight(rowIndex) : rowHeight), [rowHeight]);
        const transformedColumns = useRowSelection({columns, dataSource, rowSelection, rowKey});
        const {virtualItems, totalSize} = useVirtual({size, parentRef: scrollContentRef, estimateSize, paddingStart: headerHeight});
        const {onScroll, isScrollToLeft, isScrollToRight} = useScrollToEdge(scrollContentRef);

        const [colWidths, setColWidths] = React.useState<number[]>([]);
        const headersRef = React.useRef<HTMLDivElement>(null);

        const isScrollable = totalSize > scrollY;
        const isReady = colWidths.length > 0;

        const scrollContainerHeight = scrollY + headerHeight + (isScrollable ? scrollBarSize : 0);

        const getColWidths = () => {
            if (headersRef.current) {
                const widths: number[] = [];
                const headers = headersRef.current.querySelectorAll(".table-header");
                headers.forEach(header => {
                    const {width} = header.getBoundingClientRect();
                    widths.push(width);
                });
                setColWidths(widths);
            }
        };

        const stickyPosition = React.useMemo(() => {
            const result: Record<number, StickyPosition> = {};
            const left: number[] = [];
            const right: number[] = [];

            const leftFixedCols = ArrayUtil.compactMap(transformedColumns, (_, columnIndex) => (_.fixed === "left" ? {columnIndex, width: colWidths[columnIndex]} : null));
            const rightFixedCols = ArrayUtil.compactMap(transformedColumns, (_, columnIndex) => (_.fixed === "right" ? {columnIndex, width: colWidths[columnIndex]} : null)).reverse();

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
        }, [colWidths, transformedColumns]);

        const getFixedColStyle = (fixed: "left" | "right" | undefined, columnIndex: number): React.CSSProperties => {
            return {
                left: fixed === "left" ? stickyPosition[columnIndex].value : undefined,
                right: fixed === "right" ? stickyPosition[columnIndex].value : undefined,
            };
        };

        const getFixedColClassNames = (fixed: "left" | "right" | undefined, columnIndex: number): (string | undefined)[] => {
            const isFixedClassName = fixed ? "fixed" : "";
            const isLastFixedClassName = fixed && stickyPosition[columnIndex].isLast ? "last" : "";
            const fixedPositionClassName = fixed;
            const hideShadowClassName = (fixed === "left" && isScrollToLeft) || (fixed === "right" && isScrollToRight) ? "hide-shadow" : "";
            return [isFixedClassName, isLastFixedClassName, fixedPositionClassName, hideShadowClassName];
        };

        // get the correct column width with the occurrence of scroll bar
        React.useEffect(() => {
            getColWidths();
        }, [isScrollable]);

        return (
            <div className={["g-virtual-table", className].join(" ")} style={{width: scrollX || "100%"}}>
                {
                    <div className="scroll-content" ref={scrollContentRef} style={{height: scrollContainerHeight}} onScroll={onScroll}>
                        <div className="table" style={{height: totalSize}}>
                            <div className="table-headers" ref={headersRef} style={{height: headerHeight, width: isScrollable && !isReady ? `calc(100% - ${scrollBarSize}px)` : "100%"}}>
                                {transformedColumns.map(({title, width, align, fixed, display}, columnIndex) => {
                                    return (
                                        <div
                                            className={["table-header", ...getFixedColClassNames(fixed, columnIndex)].join(" ")}
                                            key={columnIndex}
                                            style={{display: display !== "hidden" ? "flex" : "none", flex: `1 0 ${width}px`, textAlign: align, ...getFixedColStyle(fixed, columnIndex)}}
                                        >
                                            {title}
                                        </div>
                                    );
                                })}
                            </div>
                            <div className="table-body" style={{height: `calc(100% - ${headerHeight}px)`}}>
                                {loading ? (
                                    <Spin spinning={loading} />
                                ) : dataSource.length === 0 ? (
                                    emptyPlaceholder || "暂无数据"
                                ) : (
                                    isReady &&
                                    virtualItems.map(virtualItem => {
                                        const rowIndex = virtualItem.index;
                                        const currentData = dataSource[rowIndex];
                                        return (
                                            <div
                                                key={rowIndex}
                                                className={["table-row", rowClassName, rowIndex % 2 ? "odd" : "even"].join(" ")}
                                                style={{height: virtualItem.size, transform: `translateY(${virtualItem.start}px)`}}
                                            >
                                                {transformedColumns.map((column, columnIndex) => {
                                                    const colSpan = column.colSpan ? column.colSpan(currentData, rowIndex, columnIndex) : 1;
                                                    const cellWidth = colSpan > 1 ? colWidths.slice(columnIndex, columnIndex + colSpan).reduce((acc, curr) => acc + curr, 0) : colWidths[columnIndex];
                                                    const renderData = column.display !== "hidden" && column.renderData(currentData, rowIndex);
                                                    return (
                                                        renderData && (
                                                            <div
                                                                className={["table-cell", ...getFixedColClassNames(column.fixed, columnIndex)].join(" ")}
                                                                key={columnIndex}
                                                                style={{
                                                                    height: "100%",
                                                                    width: cellWidth,
                                                                    textAlign: column.align,
                                                                    ...getFixedColStyle(column.fixed, columnIndex),
                                                                }}
                                                            >
                                                                {renderData}
                                                            </div>
                                                        )
                                                    );
                                                })}
                                            </div>
                                        );
                                    })
                                )}
                            </div>
                        </div>
                    </div>
                }
            </div>
        );
    },
    {displayName: "VirtualTable"}
);
