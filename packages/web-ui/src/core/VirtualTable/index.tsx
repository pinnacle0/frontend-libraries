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

export const VirtualTable = ReactUtil.memo("VirtualTable", function <RowType extends object>(props: Props<RowType>) {
    const {className, headerHeight = 50, rowKey = "index", scrollY: propsScrollY, scrollX: propsScrollX, ...restProps} = props;
    const [scrollY, setScrollY] = React.useState<number>(propsScrollY ?? 0);
    const [scrollX, setScrollX] = React.useState<number>(propsScrollX ?? 0);
    const containerRef = React.useRef<HTMLDivElement>(null);

    React.useEffect(() => {
        if (propsScrollY !== undefined && propsScrollX !== undefined) return;
        if (propsScrollY) setScrollY(propsScrollY);
        if (propsScrollX) setScrollX(propsScrollX);

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
                scrollX={scrollX}
                scrollY={scrollY}
                rowKey={rowKey}
                {...restProps}
            />
        </div>
    );
});

function getPadding(container: HTMLElement) {
    const {paddingLeft, paddingRight, paddingTop, paddingBottom} = getComputedStyle(container);
    const paddingX = Number(paddingLeft.replace("px", "")) + Number(paddingRight.replace("px", ""));
    const paddingY = Number(paddingTop.replace("px", "")) + Number(paddingBottom.replace("px", ""));
    return {paddingX, paddingY};
}

function getBorder(container: HTMLElement) {
    const {borderLeftWidth, borderRightWidth, borderTopWidth, borderBottomWidth} = getComputedStyle(container);
    const borderX = Number(borderLeftWidth.replace("px", "")) + Number(borderRightWidth.replace("px", ""));
    const borderY = Number(borderTopWidth.replace("px", "")) + Number(borderBottomWidth.replace("px", ""));
    return {borderX, borderY};
}
