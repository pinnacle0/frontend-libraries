import React from "react";
import type {VirtualTableRowExpand, VirtualTableColumn} from "../type";

interface Props<RowType extends object> {
    columns: VirtualTableColumn<RowType>[];
    rowExpand?: VirtualTableRowExpand<RowType>;
}

export const useRowExpand = function <RowType extends object>({columns, rowExpand}: Props<RowType>) {
    const transformedColumns = React.useMemo(() => {
        const resultColumns = columns;
        if (rowExpand) {
            const {width, fixed, title} = rowExpand;

            const rowExpandColumn: VirtualTableColumn<RowType> = {
                width,
                title: title || "",
                fixed: fixed ? "right" : undefined,
                renderData: () => null,
            };
            resultColumns.push(rowExpandColumn);
        }
        return resultColumns;
    }, [columns, rowExpand]);

    return transformedColumns;
};
