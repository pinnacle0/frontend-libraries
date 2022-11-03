import React from "react";
import {useVirtualizer, observeElementRect} from "@tanstack/react-virtual";
import {classNames} from "../../util/ClassNames";
import {Spin} from "../Spin";
import {TableRow} from "./TableRow";
import {TableHeader} from "./TableHeader";
import type {SafeReactChild, StringKey} from "../../internal/type";
import type {VirtualTableColumn, VirtualTableRowSelection} from "./type";
import {useRowSelection} from "./hooks/useRowSelection";
import {useColumns} from "./hooks/useColumns";
import {useScroll} from "./hooks/useScroll";
import "./index.less";

const HORIZONTAL_SCROLL_BAR_HEIGHT = 15;

export interface VirtualTableProps<RowType extends object> {
    dataSource: RowType[];
    columns: VirtualTableColumn<RowType>[];
    rowHeight: number;
    className?: string;
    rowClassName?: string;
    /**
     * if scrollX and scrollY is not provided, height: 100% and width: 100% will be used and please wrap the table with a container
     */
    scrollY?: number;
    scrollX?: number;
    loading?: boolean;
    emptyPlaceholder?: SafeReactChild;
    onRowClick?: (record: RowType, rowIndex: number) => void;
    /**
     * Default: index
     */
    rowKey?: StringKey<RowType> | "index";
    headerHeight?: number;
    rowSelection?: VirtualTableRowSelection<RowType>;
}

export const VirtualTable = Object.assign(
    function <RowType extends object>({
        columns,
        rowHeight,
        dataSource,
        className,
        rowClassName,
        loading,
        emptyPlaceholder,
        onRowClick,
        scrollY,
        scrollX,
        rowSelection,
        headerHeight = 50,
        rowKey = "index",
    }: VirtualTableProps<RowType>) {
        const count = dataSource.length;
        const scrollContentRef = React.useRef<HTMLDivElement | null>(null);
        const headerRef = React.useRef<HTMLDivElement | null>(null);
        const totalSize = count * rowHeight;
        const isVerticalScrollable = scrollContentRef.current ? totalSize > scrollContentRef.current.clientHeight : false;
        const isHorizontalScrollable = scrollContentRef.current ? scrollContentRef.current.scrollWidth > scrollContentRef.current.offsetWidth : false;
        const containerHeight = scrollY ? scrollY + headerHeight + (isHorizontalScrollable ? HORIZONTAL_SCROLL_BAR_HEIGHT : 0) : "100%";
        const emptyElement = emptyPlaceholder || "暂无数据";

        const transformedColumns = useRowSelection({columns, dataSource, rowKey, rowSelection});
        const rowVirtualizer = useVirtualizer({
            count,
            getScrollElement: () => scrollContentRef.current,
            estimateSize: () => rowHeight,
            observeElementRect: (instance, cb) => {
                observeElementRect(instance, cb);
                getColumnWidths();
            },
        });
        const {isReady, columnWidths, getColumnWidths, stickyPositionMap, scrollBarSize} = useColumns({headerRef, columns: transformedColumns, scrollContentRef, isScrollable: isVerticalScrollable});
        const {isScrollToLeft, isScrollToRight, onScroll} = useScroll({scrollContentRef, headerRef, isReady});

        // TODO/David: This is temporary fix of issue: https://github.com/TanStack/virtual/issues/363, please remove the code after update
        const virtualizerRef = React.useRef(rowVirtualizer);
        virtualizerRef.current = rowVirtualizer;
        React.useLayoutEffect(() => {
            const v = virtualizerRef.current;
            v._didMount()();
            v._willUpdate();
        }, [dataSource.length]);

        return (
            <div className={classNames("g-virtual-table", className)} style={{width: scrollX || "100%", height: containerHeight}}>
                {loading && (
                    <div className="mask">
                        <Spin spinning={loading} />
                    </div>
                )}
                <div
                    className={classNames("scroll-content", {"scroll-to-left": isScrollToLeft, "scroll-to-right": isScrollToRight})}
                    ref={scrollContentRef}
                    style={{height: `calc(100% - ${headerHeight}px)`, top: headerHeight}}
                    onScroll={onScroll}
                >
                    <div className="table" style={{height: totalSize}}>
                        <TableHeader headerRef={headerRef} headerHeight={headerHeight} columns={transformedColumns} stickyPositionMap={stickyPositionMap} />
                        <div className="table-body">
                            {dataSource.length === 0
                                ? emptyElement
                                : isReady &&
                                  rowVirtualizer
                                      .getVirtualItems()
                                      .map(virtualItem => (
                                          <TableRow
                                              key={virtualItem.key}
                                              rowHeight={rowHeight}
                                              onRowClick={onRowClick}
                                              virtualItem={virtualItem}
                                              data={dataSource[virtualItem.index]}
                                              columns={transformedColumns}
                                              columnWidths={columnWidths.current}
                                              scrollBarSize={scrollBarSize}
                                              stickyPositionMap={stickyPositionMap}
                                              rowClassName={rowClassName}
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
