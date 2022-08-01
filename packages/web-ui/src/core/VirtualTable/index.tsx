import React from "react";
import {useVirtual} from "react-virtual";
import {classNames} from "../../util/ClassNames";
import {Spin} from "../Spin";
import {useLayout} from "./hooks/useLayout";
import {useTransformColumn} from "./hooks/useTransformColumn";
import {TableRow} from "./TableRow";
import {TableHeader} from "./TableHeader";
import type {SafeReactChild, StringKey} from "../../internal/type";
import type {ColumnFixedPosition, VirtualTableColumn, VirtualTableRowExpand, VirtualTableRowSelection} from "./type";
import "./index.less";

export interface VirtualTableProps<RowType extends object> {
    dataSource: RowType[];
    columns: VirtualTableColumn<RowType>[];
    scrollY: number;
    rowHeight: number;
    className?: string;
    rowClassName?: string;
    /**
     * if scrollX is not provided, width: 100% will be used
     * if width: 100% is used, please wrap the table with a container
     */
    scrollX?: number;
    loading?: boolean;
    emptyPlaceholder?: SafeReactChild;
    rowSelection?: VirtualTableRowSelection<RowType>;
    onRowClick?: (record: RowType, rowIndex: number) => void;
    /**
     * Default: index
     */
    rowKey?: StringKey<RowType> | "index";
    headerHeight?: number;
    rowExpand?: VirtualTableRowExpand<RowType>;
    horizontalScrollBarSize?: number;
}

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
        onRowClick,
        scrollX,
        rowExpand,
        rowKey = "index",
        headerHeight = 50,
        horizontalScrollBarSize = 20,
    }: VirtualTableProps<RowType>) {
        const size = dataSource.length;
        const scrollContentRef = React.useRef<HTMLDivElement>(null);
        const headersRef = React.useRef<HTMLDivElement>(null);
        const estimateSize = React.useCallback(() => rowHeight, [rowHeight]);
        const overscan = rowExpand ? Math.floor(scrollY / rowHeight) : 1;

        const {virtualItems, totalSize} = useVirtual({
            size,
            parentRef: scrollContentRef,
            estimateSize,
            overscan,
        });
        const transformedColumns = useTransformColumn({columns, dataSource, rowSelection, rowKey, rowExpand});

        const isScrollable = totalSize > scrollY;
        const {scrollBarSize, stickyPosition, columnWidths, isScrollToEdge, isScrollToLeft, isScrollToRight} = useLayout({headersRef, scrollContentRef, isScrollable, columns: transformedColumns});

        const isHorizontalScrollable = scrollContentRef.current ? columnWidths.reduce((acc, curr) => acc + curr, 0) > scrollContentRef.current.clientWidth : false;
        const tableHeight = scrollY + headerHeight + (isHorizontalScrollable ? horizontalScrollBarSize : 0);
        const tableBodyHeight = scrollY + (isHorizontalScrollable ? horizontalScrollBarSize : 0);
        const emptyElement = emptyPlaceholder || "暂无数据";

        const lastShownColumnIndex: number = React.useMemo(() => transformedColumns.length - 1 - [...transformedColumns].reverse().findIndex(_ => _.display !== "hidden"), [transformedColumns]);

        // handle the edge position & shadow of the fixed columns
        const getFixedColumnClassNames = React.useCallback(
            (fixed: ColumnFixedPosition | undefined, columnIndex: number): (string | undefined)[] => {
                const isFixedClassName = fixed ? "fixed" : "";
                const isLastFixedClassName = fixed && stickyPosition[columnIndex]?.isLast ? "last" : "";
                const fixedPositionClassName = fixed;
                const hideShadowClassName = (fixed === "left" && isScrollToLeft) || (fixed === "right" && isScrollToRight) ? "hide-shadow" : "";
                return [isFixedClassName, isLastFixedClassName, fixedPositionClassName, hideShadowClassName];
            },
            [isScrollToLeft, isScrollToRight, stickyPosition]
        );

        const onScroll = React.useCallback(() => {
            requestAnimationFrame(() => {
                // only trigger in horizontal direction
                if (!scrollContentRef.current || !headersRef.current || scrollContentRef.current.scrollLeft === headersRef.current.scrollLeft) return;

                isScrollToEdge();
                // sync scrolling in header
                headersRef.current.scrollLeft = scrollContentRef.current.scrollLeft;
            });
        }, [isScrollToEdge]);

        return (
            <div className={classNames("g-virtual-table", className)} style={{width: scrollX || "100%", height: tableHeight}}>
                {loading && (
                    <div className="mask">
                        <Spin spinning={loading} />
                    </div>
                )}
                <div className="scroll-content" ref={scrollContentRef} style={{height: tableBodyHeight, top: headerHeight}} onScroll={onScroll}>
                    <div className="table" style={{height: totalSize}}>
                        <TableHeader
                            headersRef={headersRef}
                            headerHeight={headerHeight}
                            columns={transformedColumns}
                            stickyPosition={stickyPosition}
                            getFixedColumnClassNames={getFixedColumnClassNames}
                        />
                        <div className="table-body">
                            {dataSource.length === 0
                                ? emptyElement
                                : columnWidths.length > 0 &&
                                  virtualItems.map(virtualItem => (
                                      <TableRow
                                          key={virtualItem.index}
                                          rowHeight={rowHeight}
                                          onRowClick={onRowClick}
                                          virtualItem={virtualItem}
                                          data={dataSource[virtualItem.index]}
                                          columns={transformedColumns}
                                          columnWidths={columnWidths}
                                          scrollBarSize={scrollBarSize}
                                          stickyPosition={stickyPosition}
                                          lastShownColumnIndex={lastShownColumnIndex}
                                          rowClassName={rowClassName}
                                          getFixedColumnClassNames={getFixedColumnClassNames}
                                          rowExpand={rowExpand}
                                      />
                                  ))}
                        </div>
                    </div>
                </div>
            </div>
        );
    },
    {displayName: "VirtualTable"}
);
