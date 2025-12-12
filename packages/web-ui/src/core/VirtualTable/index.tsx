import React from "react";
import {classNames} from "../../util/ClassNames";
import {ReactUtil} from "../../util/ReactUtil";
import type {TableProps} from "../Table";
import {Table} from "../Table";
import "./index.less";

export type {TableRowSelection, TableColumn, TableColumns} from "../Table";

export interface VirtualTableProps<RowType extends object> extends Omit<TableProps<RowType, undefined>, "rowKey" | "scrollX" | "scrollY"> {
    rowKey?: TableProps<RowType, undefined>["rowKey"];
    scrollY?: number; // height will include header height
    scrollX?: number;
}

const containerStyle = {height: "100%", width: "100%"};

export const VirtualTable = ReactUtil.memo("VirtualTable", function <RowType extends object>(props: VirtualTableProps<RowType>) {
    const {dataSource, className, rowKey = "index", scrollY: propScrollY, emptyPlaceholder, emptyNodeStyle, ...restProps} = props;
    const [scrollY, setScrollY] = React.useState(300);
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

    const combinedEmptyNodeStyle = React.useMemo(() => {
        return {
            ...emptyNodeStyle,
            height: scrollY,
        };
    }, [scrollY, emptyNodeStyle]);

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
                rowKey={rowKey}
                emptyPlaceholder={emptyPlaceholder || "暂无数据"}
                emptyNodeStyle={combinedEmptyNodeStyle}
                {...restProps}
            />
        </div>
    );
});
