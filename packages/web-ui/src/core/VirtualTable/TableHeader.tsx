import React from "react";
import {classNames} from "../../util/ClassNames";
import type {VirtualTableColumn, StickyPosition} from "./type";

interface Props<RowType extends object> {
    headerRef: React.MutableRefObject<HTMLDivElement | null>;
    headerHeight: number;
    columns: VirtualTableColumn<RowType>[];
    stickyPositionMap: Record<number, StickyPosition>;
}

export const TableHeader = Object.assign(
    function <RowType extends object>({headerRef, headerHeight, columns, stickyPositionMap}: Props<RowType>) {
        return (
            <div className="table-headers" ref={headerRef} style={{height: headerHeight, width: scrollX || "100%"}}>
                {columns.map(({title, width, align, fixed, display}, columnIndex) => {
                    const stickyPosition = stickyPositionMap[columnIndex];
                    return (
                        <div
                            className={classNames("table-header", {fixed, left: fixed === "left", right: fixed === "right", last: stickyPosition?.isLast})}
                            key={columnIndex}
                            style={{
                                display: display !== "hidden" ? "flex" : "none",
                                flex: `1 0 ${width}px`,
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
    },
    {
        displayName: "TableHeader",
    }
);
