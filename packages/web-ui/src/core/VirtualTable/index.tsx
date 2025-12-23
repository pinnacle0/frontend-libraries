import React from "react";
import {classNames} from "../../util/ClassNames";
import {ReactUtil} from "../../util/ReactUtil";
import {Table} from "../Table";
import "./index.less";
import {useResizeObserver} from "../../hooks/useResizeObserver";
import type {VirtualTableProps} from "./type";

export type {TableRowSelection as VirtualTableRowSelection} from "../Table";
export type {VirtualTableProps, VirtualTableColumns} from "./type";

/**
 * Antd Table's scrollX behaviour is different from scrollY
 *
 * scrollY:
 * the height of the scrollable container (ignoring the container height) which will cause overflow
 * We cannot use overflow: hidden since it will cause the last few rows to be hidden
 *
 * scrollX:
 * It is the total of column width of the table
 * If scrollX > all columns width, all columns will be expanded and lose the width property
 * In order to calculate the scrollX, we need to sum up the width of all columns
 *
 * If scrollX is not provided, all column must provide width, ref: ./type.ts
 */
export const VirtualTable = ReactUtil.memo("VirtualTable", function <RowType extends object>(props: VirtualTableProps<RowType>) {
    const {dataSource, className, width = "100%", scrollY: propScrollY, emptyPlaceholder, ...restProps} = props;
    const [scrollY, setScrollY] = React.useState(propScrollY ?? 300);
    const [headerHeight, setHeaderHeight] = React.useState(0);
    const containerRef = useResizeObserver(({height}) => {
        let newScrollY = Math.max(0, height - headerHeight);
        if (propScrollY) newScrollY = Math.min(newScrollY, propScrollY);
        setScrollY(newScrollY);
    });

    // Need to listen to header change onMount so we can calculate the scrollY correctly
    const headerRef = useResizeObserver(({height}) => {
        setHeaderHeight(height);
    });
    React.useEffect(() => {
        headerRef.current = containerRef.current?.querySelector(".ant-table-header") ?? null;
    }, [containerRef, headerRef]);

    const containerStyle = React.useMemo(() => {
        return {
            width,
            height: "100%",
        };
    }, [width]);

    const scrollX = React.useMemo(() => {
        if ("scrollX" in restProps) return restProps.scrollX;
        restProps.columns.reduce((acc, column) => acc + (column.hidden ? 0 : column.width), 0);
    }, [restProps]);

    return (
        <div ref={containerRef} className={classNames("g-virtual-table", className)} style={containerStyle}>
            <Table
                // @ts-ignore: using our Table component with virtual props from antd
                virtual
                dataSource={dataSource}
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
