import React from "react";
import {classNames} from "../../util/ClassNames";
import {ReactUtil} from "../../util/ReactUtil";
import type {TableProps} from "../Table";
import {Table} from "../Table";
import "./index.less";

export type {TableRowSelection, TableColumn, TableColumns} from "../Table";

export interface VirtualTableProps<RowType extends object> extends Omit<TableProps<RowType, undefined>, "rowKey"> {
    rowKey?: TableProps<RowType, undefined>["rowKey"];
    /**
     * Antd <Table virtual /> must use number scrollX or number scrollY to work
     * if scrollX/scrollY is not provided, it will compute the width/height from the parent respectively.
     */
    scrollY?: number;
    scrollX?: number;
}

export const VirtualTable = ReactUtil.memo("VirtualTable", function <RowType extends object>(props: VirtualTableProps<RowType>) {
    const {dataSource, className, minHeaderHeight = 55, rowKey = "index", scrollX: propsScrollX, scrollY: propsScrollY, emptyPlaceholder, emptyNodeStyle, ...restProps} = props;
    const [headerHeight, setHeaderHeight] = React.useState<number>(minHeaderHeight);
    const [scrollX, setScrollX] = React.useState<number>(0); // Only used and observed when propsScrollX is not provided
    const [scrollY, setScrollY] = React.useState<number>(0); // Only used and observed when propsScrollY is not provided
    const containerRef = React.useRef<HTMLDivElement>(null);

    React.useEffect(() => {
        if (propsScrollY && propsScrollX) return;

        const parent = containerRef.current?.parentElement;
        if (!parent) return;

        const updateScroll = () => {
            const {paddingX, paddingY} = getPadding(parent);
            const {borderX, borderY} = getBorder(parent);
            const {width, height} = parent.getBoundingClientRect();
            !propsScrollX && setScrollX(Math.max(width - paddingX - borderX, 0));
            !propsScrollY && setScrollY(Math.max(height - headerHeight - paddingY - borderY, 0));
        };

        const observer = new ResizeObserver(updateScroll);
        observer.observe(parent);
        return () => {
            observer.unobserve(parent);
            observer.disconnect();
        };
    }, [propsScrollX, propsScrollY, headerHeight]);

    React.useEffect(() => {
        const computedHeaderHeight = containerRef.current?.querySelector(".ant-table-header")?.getBoundingClientRect().height;
        computedHeaderHeight && setHeaderHeight(computedHeaderHeight);
    }, [containerRef]);

    const containerStyle = React.useMemo(
        () => ({
            height: propsScrollY ? propsScrollY + headerHeight : "100%",
            width: propsScrollX ? propsScrollX : "100%",
        }),
        [propsScrollY, propsScrollX, headerHeight]
    );

    const combinedEmptyNodeStyle = React.useMemo(() => {
        return {
            ...emptyNodeStyle,
            height: propsScrollY ? propsScrollY : scrollY,
        };
    }, [propsScrollY, scrollY, emptyNodeStyle]);

    return (
        <div ref={containerRef} className={classNames("g-virtual-table", className)} style={containerStyle}>
            <Table
                // @ts-ignore: using our Table component with virtual props from antd
                virtual
                dataSource={dataSource}
                minHeaderHeight={minHeaderHeight}
                scrollX={propsScrollX ?? scrollX}
                scrollY={propsScrollY ?? scrollY}
                rowKey={rowKey}
                emptyPlaceholder={emptyPlaceholder || "暂无数据"}
                emptyNodeStyle={combinedEmptyNodeStyle}
                {...restProps}
            />
        </div>
    );
});

// parseFloat removes the "px" suffix
function getPadding(container: HTMLElement) {
    const {paddingLeft, paddingRight, paddingTop, paddingBottom} = getComputedStyle(container);
    const paddingX = parseFloat(paddingLeft) + parseFloat(paddingRight);
    const paddingY = parseFloat(paddingTop) + parseFloat(paddingBottom);
    return {paddingX, paddingY};
}

function getBorder(container: HTMLElement) {
    const {borderLeftWidth, borderRightWidth, borderTopWidth, borderBottomWidth} = getComputedStyle(container);
    const borderX = parseFloat(borderLeftWidth) + parseFloat(borderRightWidth);
    const borderY = parseFloat(borderTopWidth) + parseFloat(borderBottomWidth);
    return {borderX, borderY};
}
