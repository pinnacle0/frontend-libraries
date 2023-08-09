import "../../internal/polyfill/ResizeObserver";
import React from "react";
import {useVirtualizer, observeElementRect} from "@tanstack/react-virtual";
import {classNames} from "../../util/ClassNames";
import {Spin} from "../Spin";
import {TableRow} from "./TableRow";
import {TableHeader} from "./TableHeader";
import type {StringKey} from "../../internal/type";
import type {VirtualTableColumn, VirtualTableRowSelection} from "./type";
import {useRowSelection} from "./hooks/useRowSelection";
import {useColumnWidths} from "./hooks/useColumnWidths";
import {useScrollBarSize} from "./hooks/useScrollBarSize";
import {useScrollToEdge, useSyncScroll, useScrollable} from "./hooks/useScroll";
import {useColumnsStickyPosition} from "./hooks/useColumnsStickyPosition";
import {ReactUtil} from "../../util/ReactUtil";
import "./index.less";

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
    overscan?: number;
    loading?: boolean;
    emptyPlaceholder?: React.ReactElement | string | number;
    onRowClick?: (record: RowType, rowIndex: number) => void;
    /**
     * Default: index
     */
    rowKey?: StringKey<RowType> | "index";
    headerHeight?: number;
    rowSelection?: VirtualTableRowSelection<RowType>;
}

export const VirtualTable = ReactUtil.memo("VirtualTable", function <
    RowType extends object,
>({columns, rowHeight, dataSource, className, rowClassName, loading, emptyPlaceholder, onRowClick, scrollY, scrollX, overscan, rowSelection, headerHeight = 50, rowKey = "index"}: VirtualTableProps<RowType>) {
    const count = dataSource.length;
    const scrollContentRef = React.useRef<HTMLDivElement | null>(null);
    const totalSize = count * rowHeight;
    const emptyElement = emptyPlaceholder || "暂无数据";

    const transformedColumns = useRowSelection({columns, dataSource, rowKey, rowSelection});
    const rowVirtualizer = useVirtualizer({
        count,
        getScrollElement: () => scrollContentRef.current,
        estimateSize: () => rowHeight,
        observeElementRect: (instance, cb) => {
            observeElementRect(instance, cb);
        },
        overscan,
    });
    const {headerRef, getHeaderRef, columnWidths} = useColumnWidths();
    const scrollBarSize = useScrollBarSize();
    const syncScroll = useSyncScroll(scrollContentRef, headerRef);
    const checkIsScrollToEdge = useScrollToEdge(scrollContentRef);
    const {scrollable, checkScrollable} = useScrollable(scrollContentRef);
    const columnsStickyPosition = useColumnsStickyPosition(transformedColumns, columnWidths);

    const onScroll = React.useCallback(() => {
        syncScroll();
        checkIsScrollToEdge();
    }, [syncScroll, checkIsScrollToEdge]);

    React.useEffect(() => {
        checkIsScrollToEdge();
    }, [columnWidths, checkIsScrollToEdge]);

    React.useEffect(() => {
        checkScrollable();
    }, [totalSize, columnWidths, checkScrollable]);

    const containerHeight = scrollY ? scrollY + headerHeight + (scrollable.horizontal ? scrollBarSize : 0) : "100%";

    return (
        <div className={classNames("g-virtual-table", className)} style={{width: scrollX || "100%", height: containerHeight}}>
            {loading && (
                <div className="mask">
                    <Spin spinning={loading} />
                </div>
            )}
            <div className="scroll-content" ref={scrollContentRef} style={{height: `calc(100% - ${headerHeight}px)`, top: headerHeight}} onScroll={onScroll}>
                <div className="table" style={{height: totalSize}}>
                    <TableHeader headerRef={getHeaderRef} headerHeight={headerHeight} columns={transformedColumns} columnsStickyPosition={columnsStickyPosition} />
                    {columnWidths.length > 0 && (
                        <div className="table-body">
                            {dataSource.length === 0
                                ? emptyElement
                                : rowVirtualizer
                                      .getVirtualItems()
                                      .map(virtualItem => (
                                          <TableRow
                                              key={virtualItem.key}
                                              rowHeight={rowHeight}
                                              onRowClick={onRowClick}
                                              virtualItem={virtualItem}
                                              data={dataSource[virtualItem.index]}
                                              columns={transformedColumns}
                                              columnWidths={columnWidths}
                                              scrollBarSize={scrollable.vertical ? scrollBarSize : 0}
                                              columnsStickyPosition={columnsStickyPosition}
                                              rowClassName={rowClassName}
                                          />
                                      ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
});
