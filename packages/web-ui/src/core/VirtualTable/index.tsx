import React from "react";
import {classNames} from "../../util/ClassNames";
import {ReactUtil} from "../../util/ReactUtil";
import type {TableProps} from "../Table";
import {Table} from "../Table";
import {useParentResizeObserver} from "../../hooks/useParentResizeObserver";
import {NumberUtil} from "../../internal/NumberUtil";
import "./index.less";

export * from "./OldVirtualTable";

export type {TableRowSelection, TableColumn, TableColumns} from "../Table";

export interface Props<RowType extends object> extends Omit<TableProps<RowType, undefined>, "rowKey"> {
    rowKey?: TableProps<RowType, undefined>["rowKey"];
    /**
     * Antd <Table virtual /> must use number scrollX or number scrollY to work
     * if scrollX/scrollY is not provided, it will compute the width/height from the parent respectively.
     */
    scrollY?: number;
    scrollX?: number;
}

// TODO/Ian: update noData placeholder
export const VirtualTable = ReactUtil.memo("VirtualTable", function <RowType extends object>(props: Props<RowType>) {
    const {className, minHeaderHeight = 55, rowKey = "index", scrollX: propsScrollX, scrollY: propsScrollY, ...restProps} = props;
    const [headerHeight, setHeaderHeight] = React.useState<number>(minHeaderHeight);
    const [scrollX, setScrollX] = React.useState<number>(propsScrollX ?? 0);
    const [scrollY, setScrollY] = React.useState<number>(propsScrollY ?? 0);
    const containerRef = React.useRef<HTMLDivElement>(null);

    useParentResizeObserver(
        containerRef,
        React.useCallback(
            (parentRect: DOMRectReadOnly, parentRef: HTMLElement) => {
                const {paddingX, paddingY} = getPadding(parentRef);
                const {borderX, borderY} = getBorder(parentRef);

                const containerRect = containerRef.current!.getBoundingClientRect();

                setScrollY(NumberUtil.clamp(parentRect.height - headerHeight - paddingY - borderY, 0, containerRect.height));
                setScrollX(NumberUtil.clamp(parentRect.width - paddingX - borderX, 0, containerRect.width));
            },
            [headerHeight]
        )
    );

    React.useEffect(() => {
        const computedHeaderHeight = containerRef.current?.querySelector(".ant-table-header")?.getBoundingClientRect().height;
        computedHeaderHeight && setHeaderHeight(computedHeaderHeight);
    }, [containerRef]);

    const containerStyle = React.useMemo(() => {
        return {
            height: propsScrollY ? propsScrollY + headerHeight : "100%",
            width: propsScrollX ? propsScrollX : "100%",
        };
    }, [propsScrollY, propsScrollX, headerHeight]);

    return (
        <div ref={containerRef} className={classNames("g-virtual-table", className)} style={containerStyle}>
            <Table
                // @ts-ignore: using our Table component with virtual props from antd
                virtual
                minHeaderHeight={minHeaderHeight}
                scrollX={scrollX}
                scrollY={scrollY}
                rowKey={rowKey}
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
