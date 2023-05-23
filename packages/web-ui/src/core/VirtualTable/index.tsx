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

//  TODO: timeout 1s visibiity = hidden
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
        overscan,
        rowSelection,
        headerHeight = 50,
        rowKey = "index",
    }: VirtualTableProps<RowType>) {
        const count = dataSource.length;
        const scrollContentRef = React.useRef<HTMLDivElement | null>(null);
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
            overscan,
        });
        const {headerRef, columnWidths, getColumnWidths, columnsStickyPosition} = useColumns({columns: transformedColumns});
        const {onScroll, scrollBarSize, tableBodyRef} = useScroll({scrollContentRef, headerRef, isScrollable: isVerticalScrollable});

        React.useEffect(() => {
            // avoid the table content get pressed together on mount
            setTimeout(() => scrollContentRef.current && (scrollContentRef.current.style.visibility = "visible"), 1000);
        }, []);

        return (
            <div className={classNames("g-virtual-table", className)} style={{width: scrollX || "100%", height: containerHeight}}>
                {loading && (
                    <div className="mask">
                        <Spin spinning={loading} />
                    </div>
                )}
                <div className="scroll-content" ref={scrollContentRef} style={{height: `calc(100% - ${headerHeight}px)`, top: headerHeight}} onScroll={onScroll}>
                    <div className="table" style={{height: totalSize}}>
                        <TableHeader headerRef={headerRef} headerHeight={headerHeight} columns={transformedColumns} columnsStickyPosition={columnsStickyPosition} />
                        {columnWidths.length > 0 && (
                            <div className="table-body" ref={tableBodyRef}>
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
                                                  scrollBarSize={scrollBarSize}
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
    },
    {displayName: "VirtualTable"}
);
