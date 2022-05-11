import React from "react";
import {useVirtual} from "react-virtual";
import {Spin} from "../Spin";
import {useRowSelection} from "./useRowSelection";
import {useScrollToEdge} from "./useScrollToEdge";
import type {SafeReactChild, StringKey} from "../../internal/type";
import {useScrollBarSize} from "./useScrollBarSize";
import {useColumnWidths} from "./useColumnWidths";
import {useStickyPosition} from "./useStickyPosition";
import type {ColumnFixedPosition, VirtualTableColumn, VirtualTableRowSelection} from "./type";
import {TableRow} from "./TableRow";
import {TableHeader} from "./TableHeader";
import "./index.less";

export interface VirtualTableProps<RowType extends object> {
    dataSource: RowType[];
    columns: VirtualTableColumn<RowType>[];
    scrollY: number;
    rowHeight: number | ((rowIndex: number) => number);
    onRowClick?: (record: RowType, rowIndex: number) => number;
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
    /**
     * Default: index
     */
    rowKey?: StringKey<RowType> | "index";
    headerHeight?: number;
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
        rowKey = "index",
        headerHeight = 50,
    }: VirtualTableProps<RowType>) {
        const size = dataSource.length;
        const scrollContentRef = React.useRef<HTMLDivElement>(null);
        const headersRef = React.useRef<HTMLDivElement>(null);
        const columnWidths = useColumnWidths(headersRef);
        const estimateSize = React.useCallback((rowIndex: number) => (typeof rowHeight === "function" ? rowHeight(rowIndex) : rowHeight), [rowHeight]);

        const {virtualItems, totalSize} = useVirtual({size, parentRef: scrollContentRef, estimateSize});
        const {onScroll: isScrollToEdge, isScrollToLeft, isScrollToRight} = useScrollToEdge(scrollContentRef);
        const transformedColumns = useRowSelection({columns, dataSource, rowSelection, rowKey});

        const isScrollable = totalSize > scrollY;
        const tableHeight = scrollY + headerHeight;
        const tableBodyHeight = scrollY;
        const emptyElement = emptyPlaceholder || "暂无数据";

        const scrollBarSize = useScrollBarSize(scrollContentRef, isScrollable);
        const stickyPosition = useStickyPosition(transformedColumns, columnWidths);
        const lastShownColumnIndex: number = React.useMemo(() => columns.length - 1 - [...columns].reverse().findIndex(_ => _.display !== "hidden"), [columns]);

        // handle the edge position & shadow of the fixed columns
        const getFixedColumnClassNames = React.useCallback(
            (fixed: ColumnFixedPosition | undefined, columnIndex: number): (string | undefined)[] => {
                const isFixedClassName = fixed ? "fixed" : "";
                const isLastFixedClassName = fixed && stickyPosition.current[columnIndex]?.isLast ? "last" : "";
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
            <div className={["g-virtual-table", className].join(" ")} style={{width: scrollX || "100%", height: tableHeight}}>
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
                            transformedColumns={transformedColumns}
                            stickyPosition={stickyPosition}
                            getFixedColumnClassNames={getFixedColumnClassNames}
                        />
                        <div className="table-body">
                            {dataSource.length === 0
                                ? emptyElement
                                : virtualItems.map((virtualItem, rowIndex) => (
                                      <TableRow
                                          key={rowIndex}
                                          onRowClick={onRowClick}
                                          virtualItem={virtualItem}
                                          dataSource={dataSource}
                                          transformedColumns={transformedColumns}
                                          columnWidths={columnWidths}
                                          scrollBarSize={scrollBarSize}
                                          stickyPosition={stickyPosition}
                                          lastShownColumnIndex={lastShownColumnIndex}
                                          rowClassName={rowClassName}
                                          getFixedColumnClassNames={getFixedColumnClassNames}
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
