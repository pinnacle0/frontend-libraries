import React from "react";
import {classNames} from "../../util/ClassNames";
import {ReactUtil} from "../../util/ReactUtil";
import {Table, type TableProps} from "../Table";

export * from "./OldVirtualTable";

export type {TableRowSelection, TableColumn, TableColumns} from "../Table";

export interface Props<RowType extends object> extends Omit<TableProps<RowType, undefined>, "rowKey"> {
    rowHeight: number;
    className?: string;
    headerHeight?: number;
    rowKey?: TableProps<RowType, undefined>["rowKey"];
    /**
     * Antd <Table virtual /> must use number scrollX or number scrollY to work
     * if scrollX and scrollY is not provided, height: 100% and width: 100% will be used and please wrap the table with a container
     */
    scrollY?: number;
    scrollX?: number;
}

// TODO/Ian: update
export const VirtualTable = ReactUtil.memo("VirtualTable", function <RowType extends object>(props: Props<RowType>) {
    const {rowHeight, className, headerHeight = 50, rowKey = "index", scrollY: propsScrollY, scrollX: propsScrollX, ...restProps} = props;
    const [scrollY, setScrollY] = React.useState<number>(propsScrollY ?? 0);
    const [scrollX, setScrollX] = React.useState<number>(propsScrollX ?? 0);
    const containerRef = React.useRef<HTMLDivElement>(null);

    React.useEffect(() => {
        if (propsScrollY !== undefined && propsScrollX !== undefined) return;

        const container = containerRef.current?.parentElement;
        if (!container) return;

        const updateScroll = () => {
            const contentRect = container.getBoundingClientRect();
            !propsScrollY && setScrollY(Math.max(0, contentRect.height - headerHeight));
            !propsScrollX && setScrollX(Math.max(0, contentRect.width));
        };

        updateScroll();

        const resizeObserver = new ResizeObserver(updateScroll);
        resizeObserver.observe(container);

        return () => {
            resizeObserver.disconnect();
        };
    }, [propsScrollY, propsScrollX, headerHeight]);

    return (
        <div ref={containerRef} className={classNames("g-virtual-table", className)} style={{height: propsScrollY ?? scrollY, width: propsScrollX ?? scrollX}}>
            <Table
                // @ts-ignore: using Our Table component with virtual props from antd
                virtual
                scrollX={scrollX}
                scrollY={scrollY}
                rowKey={rowKey}
                onRow={() => ({style: {height: rowHeight}})}
                {...restProps}
            />
        </div>
    );
});
