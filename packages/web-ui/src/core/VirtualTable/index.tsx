import React from "react";
import {useVirtual} from "react-virtual";
import {ArrayUtil} from "../../internal/ArrayUtil";
import {Spin} from "../Spin";
import {useRowSelection} from "./useRowSelection";
import {useScrollToEdge} from "./useScrollToEdge";
import type {SafeReactChildren, SafeReactChild, StringKey} from "../../internal/type";
import "./index.less";

/**
 * Similar usage of Antd Table but only support partial features: fixed columns, row selection
 */

interface StickyPosition {
    value: number;
    isLast: boolean;
}

export type VirtualTableRowSelection<RowType extends object> = {
    width: number;
    selectedRowKeys: React.Key[];
    onChange: (selectedRowKeys: React.Key[], selectedRows: RowType[]) => void;
    /**
     * Can only sticky in left
     */
    fixed?: boolean;
    isDisabled?: (data: RowType, rowIndex: number) => boolean;
    isSelectAllDisabled?: boolean;
    /**
     * Attention:
     * If title is provided, the select all checkbox wil be overridden
     */
    title?: React.ReactElement | React.ReactChild;
};

export type VirtualTableColumn<RowType extends object> = {
    title: React.ReactElement | React.ReactChild;
    width: number;
    /**
     * Attention:
     * If renderData return null, the corresponding table cell will not render
     */
    renderData: (record: RowType, rowIndex: number) => SafeReactChildren | undefined;
    align?: "left" | "right" | "center";
    display?: "default" | "hidden";
    fixed?: "left" | "right";
    /**
     * Attention:
     * The overridden cell should return null in renderData props:
     * e.g. [{colSpan: 3, renderData: () => <div />}, {renderData: () => null}], {renderData: () => null}
     */
    colSpan?: (record: RowType, rowIndex: number, colIndex: number) => number;
};

export interface VirtualTableProps<RowType extends object> {
    dataSource: RowType[];
    columns: VirtualTableColumn<RowType>[];
    scrollY: number;
    rowHeight: number | ((rowIndex: number) => number);
    className?: string;
    rowClassName?: string;
    /**
     * if scrollX is not provided, width: 100% will be used
     */
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
// TODO/David: handle for different size of scrollbar
const scrollBarSize = 15;

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
        const {virtualItems, totalSize} = useVirtual({size, parentRef: scrollContentRef, estimateSize});
        const {onScroll, isScrollToLeft, isScrollToRight} = useScrollToEdge(scrollContentRef);

        const [colWidths, setColWidths] = React.useState<number[]>([]);
        const isColWidthsReady = colWidths.length > 0;
        const headersRef = React.useRef<HTMLDivElement>(null);

        const isScrollable = totalSize > scrollY;

        const scrollContainerHeight = scrollY - headerHeight;

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
            <div className={["g-virtual-table", className].join(" ")} style={{width: scrollX || "100%", height: scrollY}}>
                <div className="scroll-content" ref={scrollContentRef} style={{height: scrollContainerHeight, top: headerHeight}} onScroll={onScroll}>
                    {loading && (
                        <div className="mask">
                            <Spin spinning={loading} />
                        </div>
                    )}
                    <div className="table" style={{height: totalSize}}>
                        <div className="table-headers" ref={headersRef} style={{height: headerHeight, width: scrollX || "100%"}}>
                            {transformedColumns.map(({title, width, align, fixed, display}, columnIndex) => {
                                const headerStyle = {
                                    display: display !== "hidden" ? "flex" : "none",
                                    flex: `1 0 ${width}px`,
                                    textAlign: align,
                                    left: fixed === "left" ? stickyPosition[columnIndex].value : undefined,
                                    right: fixed === "right" ? stickyPosition[columnIndex].value : undefined,
                                };
                                return (
                                    <div className={["table-header", ...getFixedColClassNames(fixed, columnIndex)].join(" ")} key={columnIndex} style={headerStyle}>
                                        {title}
                                    </div>
                                );
                            })}
                        </div>
                        <div className="table-body" style={{height: `calc(100% - ${headerHeight}px)`}}>
                            {dataSource.length === 0
                                ? emptyPlaceholder || "暂无数据"
                                : isColWidthsReady &&
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
                                                  const isLastColumn = columnIndex === transformedColumns.length - 1;
                                                  return (
                                                      renderData && (
                                                          <div
                                                              className={["table-cell", ...getFixedColClassNames(column.fixed, columnIndex)].join(" ")}
                                                              key={columnIndex}
                                                              style={{
                                                                  height: "100%",
                                                                  width: cellWidth - (isLastColumn ? scrollBarSize : 0),
                                                                  textAlign: column.align,
                                                                  left: column.fixed === "left" ? stickyPosition[columnIndex].value : undefined,
                                                                  right: column.fixed === "right" ? stickyPosition[columnIndex].value - (isLastColumn ? 0 : scrollBarSize) : undefined,
                                                              }}
                                                          >
                                                              {renderData}
                                                          </div>
                                                      )
                                                  );
                                              })}
                                          </div>
                                      );
                                  })}
                        </div>
                    </div>
                </div>
            </div>
        );
    },
    {displayName: "VirtualTable"}
);
