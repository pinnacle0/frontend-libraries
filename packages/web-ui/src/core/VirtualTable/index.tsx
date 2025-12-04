import React from "react";
import {classNames} from "../../util/ClassNames";
import {ReactUtil} from "../../util/ReactUtil";
import type {TableProps} from "../Table";
import {Table} from "../Table";
import "./index.less";

export * from "./OldVirtualTable";

export type {TableRowSelection, TableColumn, TableColumns} from "../Table";

export interface Props<RowType extends object> extends Omit<TableProps<RowType, undefined>, "rowKey"> {
    className?: string;
    headerHeight?: number;
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
    const {className, headerHeight = 50, rowKey = "index", scrollY: propsScrollY, scrollX: propsScrollX, ...restProps} = props;
    const [scrollY, setScrollY] = React.useState<number>(propsScrollY ?? 0);
    const [scrollX, setScrollX] = React.useState<number>(propsScrollX ?? 0);
    const containerRef = React.useRef<HTMLDivElement>(null);

    // TODO/Ian: scrollX, scrollY should respect to the container's rect
    React.useEffect(() => {
        if (propsScrollY) setScrollY(propsScrollY);
        if (propsScrollX) setScrollX(propsScrollX);
        if (propsScrollY !== undefined && propsScrollX !== undefined) return;

        const container = containerRef.current?.parentElement;
        if (!container) return;

        const updateScroll = () => {
            const contentRect = container.getBoundingClientRect();
            const {paddingX, paddingY} = getPadding(container);
            const {borderX, borderY} = getBorder(container);

            propsScrollY === undefined && setScrollY(Math.max(0, contentRect.height - headerHeight - paddingY - borderY));
            propsScrollX === undefined && setScrollX(Math.max(0, contentRect.width - paddingX - borderX));
        };

        updateScroll();

        const resizeObserver = new ResizeObserver(updateScroll);
        resizeObserver.observe(container);

        return () => {
            resizeObserver.unobserve(container);
            resizeObserver.disconnect();
        };
    }, [propsScrollY, propsScrollX, headerHeight]);

    const containerStyle = React.useMemo(
        () => ({
            height: propsScrollY ? propsScrollY + headerHeight : "100%",
            width: propsScrollX ? propsScrollX : "100%",
        }),
        [propsScrollY, propsScrollX, headerHeight]
    );

    return (
        <div ref={containerRef} className={classNames("g-virtual-table", className)} style={containerStyle}>
            <Table
                // @ts-ignore: using our Table component with virtual props from antd
                virtual
                headerHeight={headerHeight}
                scrollX={propsScrollX ?? scrollX}
                scrollY={propsScrollY ?? scrollY}
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
