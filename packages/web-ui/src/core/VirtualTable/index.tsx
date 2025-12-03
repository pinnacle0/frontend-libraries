import React from "react";
import {classNames} from "../../util/ClassNames";
import {ReactUtil} from "../../util/ReactUtil";
import {Table, type TableProps} from "../Table";
import "./index.less";

export * from "./OldVirtualTable";

export type {TableRowSelection, TableColumn, TableColumns} from "../Table";

// TODO/Ian: replace with antd <Table virtual />
export interface Props<RowType extends object> extends Omit<TableProps<RowType, undefined>, "rowKey"> {
    rowHeight: number;
    className?: string;
    overscan?: number;
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
    const {rowHeight, className, overscan, headerHeight, rowKey = "index", scrollY: propsScrollY, scrollX: propsScrollX, ...restProps} = props;
    const [scrollY, setScrollY] = React.useState<number | string>(propsScrollY ?? 300);
    const [scrollX, setScrollX] = React.useState<number | string>(propsScrollX ?? 300);
    const containerRef = React.useRef<HTMLDivElement>(null);

    // React.useEffect(() => {
    //     if (propsScrollY !== undefined) return;

    //     const container = containerRef.current?.parentElement;
    //     if (!container) return;

    //     const updateScrollY = () => {
    //         const contentHeight = container.getBoundingClientRect().height;
    //         setScrollY(Math.max(0, contentHeight - headerHeight));
    //     };

    //     updateScrollY();

    //     const resizeObserver = new ResizeObserver(updateScrollY);
    //     resizeObserver.observe(container);

    //     return () => {
    //         resizeObserver.disconnect();
    //     };
    // }, [propsScrollY, headerHeight]);

    return (
        <div ref={containerRef} className={classNames("g-virtual-table", className)} style={{height: "100%"}}>
            <Table
                // @ts-ignore: using Our Table component with virtual props from antd
                virtual
                scrollX={scrollX}
                scrollY={scrollY}
                rowKey={rowKey}
                {...restProps}
            />
        </div>
    );
});
