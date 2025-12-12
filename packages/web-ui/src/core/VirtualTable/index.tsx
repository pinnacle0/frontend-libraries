import React from "react";
import {classNames} from "../../util/ClassNames";
import {ReactUtil} from "../../util/ReactUtil";
import type {TableColumn, TableProps} from "../Table";
import {Table} from "../Table";
import "./index.less";

export type {TableRowSelection as VirtualTableRowSelection} from "../Table";

/**
 * Antd Table's scrollX behaviour is different from scrollY
 *
 * scrollY:
 * the height of the scrollable container (ignoring the container height) which will cause overflow
 * We cannot use overflow: hidden since it will cause the last few rows to be hidden
 *
 * scrollX:
 * It is the total scroll width of the table
 * If scrollX > all columns width, all columns will be expanded and lose the width property
 * In order to calculate the scrollX, we need to sum up the width of all columns
 *
 * For future refactor:
 * If want to use column without width, must refactor to either pass column width or pass scrollX props
 */

export interface VirtualTableColumn<RowType extends object> extends Omit<TableColumn<RowType>, "width"> {
    width: number;
}
export type VirtualTableColumns<RowType extends object> = VirtualTableColumn<RowType>[];

export interface VirtualTableProps<RowType extends object> extends Omit<TableProps<RowType, undefined>, "columns" | "scrollX" | "scrollY"> {
    columns: VirtualTableColumn<RowType>[];
    width?: number | string;
    scrollY?: number;
}

export const VirtualTable = ReactUtil.memo("VirtualTable", function <RowType extends object>(props: VirtualTableProps<RowType>) {
    const {dataSource, columns, className, width = "100%", scrollY: propScrollY, emptyPlaceholder, ...restProps} = props;
    const [scrollY, setScrollY] = React.useState(propScrollY ?? 300);
    const [headerHeight, setHeaderHeight] = React.useState(0);
    const containerRef = React.useRef<HTMLDivElement>(null);

    React.useEffect(() => {
        const parent = containerRef.current?.parentElement;
        if (!parent) return;

        const observer = new ResizeObserver((entries: ResizeObserverEntry[]) => {
            const parentHeight = entries[0].contentRect.height;
            let newScrollY = Math.max(0, parentHeight - headerHeight);
            if (propScrollY) newScrollY = Math.min(newScrollY, propScrollY);
            setScrollY(newScrollY);
        });

        observer.observe(parent);
        return () => {
            observer.unobserve(parent);
            observer.disconnect();
        };
    }, [propScrollY, headerHeight]);

    // Need to listen to header change onMount so we can calculate the scrollY correctly
    React.useEffect(() => {
        const header = containerRef.current?.querySelector(".ant-table-header");
        if (!header) return;

        const observer = new ResizeObserver(entries => {
            setHeaderHeight(entries[0].contentRect.height);
        });
        observer.observe(header);
        return () => {
            observer.unobserve(header);
            observer.disconnect();
        };
    }, []);

    const containerStyle = React.useMemo(() => {
        return {
            width,
            height: "100%",
        };
    }, [width]);

    const scrollX = React.useMemo(() => {
        return columns.reduce((acc, column) => acc + (column.hidden ? 0 : column.width), 0);
    }, [columns]);

    return (
        <div ref={containerRef} className={classNames("g-virtual-table", className)} style={containerStyle}>
            <Table
                // @ts-ignore: using our Table component with virtual props from antd
                virtual
                dataSource={dataSource}
                columns={columns}
                /**
                 * Antd <Table virtual /> must use number scrollX or number scrollY to work
                 */
                scrollY={scrollY}
                scrollX={scrollX}
                emptyPlaceholder={emptyPlaceholder || "暂无数据"}
                {...restProps}
            />
        </div>
    );
});
