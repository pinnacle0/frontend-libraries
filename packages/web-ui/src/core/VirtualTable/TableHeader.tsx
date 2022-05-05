import React from "react";
import type {ColumnFixedPosition, VirtualTableColumn} from "./type";
import type {StickyPosition} from "./useStickyPosition";

interface Props<RowType extends object> {
    headersRef: React.RefObject<HTMLDivElement>;
    headerHeight: number;
    transformedColumns: VirtualTableColumn<RowType>[];
    stickyPosition: Record<number, StickyPosition>;
    getFixedColumnClassNames: (fixed: ColumnFixedPosition | undefined, columnIndex: number) => (string | undefined)[];
}

export const TableHeader = Object.assign(
    function <RowType extends object>({headersRef, headerHeight, transformedColumns, stickyPosition, getFixedColumnClassNames}: Props<RowType>) {
        return (
            <div className="table-headers" ref={headersRef} style={{height: headerHeight, width: scrollX || "100%"}}>
                {transformedColumns.map(({title, width, align, fixed, display}, columnIndex) => {
                    const stickyPositionValue = stickyPosition[columnIndex]?.value || 0;
                    return (
                        <div
                            className={["table-header", ...getFixedColumnClassNames(fixed, columnIndex)].join(" ")}
                            key={columnIndex}
                            style={{
                                display: display !== "hidden" ? "flex" : "none",
                                flex: `1 0 ${width}px`,
                                textAlign: align,
                                left: fixed === "left" ? stickyPositionValue : undefined,
                                right: fixed === "right" ? stickyPositionValue : undefined,
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
