import React from "react";
import {ReactUtil} from "../../../util/ReactUtil";
import {classNames} from "../../../util/ClassNames";
import type {VirtualTableColumn, ColumnsStickyPosition} from "./type";

interface Props<RowType extends object> {
    headerRef: React.RefObject<HTMLDivElement | null> | ((node: HTMLDivElement | null) => void);
    headerHeight: number;
    columns: VirtualTableColumn<RowType>[];
    columnsStickyPosition: ColumnsStickyPosition;
}

export const TableHeader = ReactUtil.memo("TableHeader", function <RowType extends object>({headerRef, headerHeight, columns, columnsStickyPosition}: Props<RowType>) {
    return (
        <div className="table-headers" ref={headerRef} style={{height: headerHeight, width: scrollX || "100%"}}>
            {columns.map(({title, width, align, fixed, display}, columnIndex) => {
                const stickyPosition = columnsStickyPosition[columnIndex];
                return (
                    <div
                        className={classNames("table-header", {fixed, left: fixed === "left", right: fixed === "right", last: stickyPosition?.isLast})}
                        key={columnIndex}
                        style={{
                            display: display !== "hidden" ? "flex" : "none",
                            flex: `1 0 ${width}px`,
                            justifyContent: align === "center" ? "center" : align === "right" ? "flex-end" : "flex-start",
                            textAlign: align,
                            left: fixed === "left" ? stickyPosition?.value : undefined,
                            right: fixed === "right" ? stickyPosition?.value : undefined,
                        }}
                    >
                        {title}
                    </div>
                );
            })}
        </div>
    );
});
