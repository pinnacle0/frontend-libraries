import React from "react";
import {classNames} from "../../util/ClassNames";
import {ReactUtil} from "../../util/ReactUtil";
import type {TableProps} from "../Table";
import {Table} from "../Table";
import "./index.less";

export type {TableRowSelection, TableColumn, TableColumns} from "../Table";

export interface VirtualTableProps<RowType extends object> extends Omit<TableProps<RowType, undefined>, "rowKey" | "scrollX" | "scrollY"> {
    rowKey?: TableProps<RowType, undefined>["rowKey"];
    height?: number; // height will include header height
    width?: number;
}

export const VirtualTable = ReactUtil.memo("VirtualTable", function <RowType extends object>(props: VirtualTableProps<RowType>) {
    const {dataSource, className, rowKey = "index", height: propHeight, width: propWidth, emptyPlaceholder, emptyNodeStyle, ...restProps} = props;
    const [height, setHeight] = React.useState<number | "100%">(propHeight ?? "100%");
    const [width, setWidth] = React.useState<number | "100%">(propWidth ?? "100%");
    const [headerHeight, setHeaderHeight] = React.useState<number>(0);
    const [scrollX, setScrollX] = React.useState<number>(0);
    const [scrollY, setScrollY] = React.useState<number>(0);
    const containerRef = React.useRef<HTMLDivElement>(null);

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
    }, [setHeaderHeight]);

    React.useEffect(() => {
        setHeight(propHeight ?? "100%");
        setWidth(propWidth ?? "100%");
    }, [propHeight, propWidth]);

    React.useEffect(() => {
        const parent = containerRef.current?.parentElement;
        if (!parent) return;

        const observer = new ResizeObserver((entries: ResizeObserverEntry[]) => {
            const {width: parentWidth, height: parentHeight} = entries[0].contentRect;

            let newHeight = Math.max(parentHeight, 0);
            let newWidth = Math.max(parentWidth, 0);
            if (propHeight) newHeight = Math.min(newHeight, propHeight);
            if (propWidth) newWidth = Math.min(newWidth, propWidth);

            setHeight(newHeight);
            setWidth(newWidth);

            setScrollY(newHeight - headerHeight);
            setScrollX(newWidth);
        });

        observer.observe(parent);
        return () => {
            observer.unobserve(parent);
            observer.disconnect();
        };
    }, [propHeight, propWidth, headerHeight]);

    const containerStyle = React.useMemo(() => ({height, width}), [height, width]);

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
                scrollX={scrollX}
                scrollY={scrollY}
                rowKey={rowKey}
                emptyPlaceholder={emptyPlaceholder || "暂无数据"}
                emptyNodeStyle={combinedEmptyNodeStyle}
                {...restProps}
            />
        </div>
    );
});
