import type React from "react";
import {useRowExpand} from "./useRowExpand";
import {useRowSelection} from "./useRowSelection";
import type {VirtualTableColumn, VirtualTableRowExpand, VirtualTableRowSelection} from "../type";

interface Props<RowType extends object> {
    columns: VirtualTableColumn<RowType>[];
    dataSource: RowType[];
    rowKey: "index" | React.Key;
    rowSelection?: VirtualTableRowSelection<RowType>;
    rowExpand?: VirtualTableRowExpand<RowType>;
}

export const useTransformColumn = function <RowType extends object>({columns, dataSource, rowKey, rowExpand, rowSelection}: Props<RowType>) {
    const columnsWithRowSelection = useRowSelection({columns, dataSource, rowSelection, rowKey});
    const transformedColumns = useRowExpand({columns: columnsWithRowSelection, rowExpand});

    return transformedColumns;
};
