import React from "react";
import {Checkbox} from "../Checkbox";
import {ArrayUtil} from "../../internal/ArrayUtil";
import type {VirtualTableRowSelection, VirtualTableColumn} from "./index";

interface Props<RowType extends object> {
    columns: VirtualTableColumn<RowType>[];
    dataSource: RowType[];
    rowSelection?: VirtualTableRowSelection<RowType>;
    rowKey: "index" | React.Key;
}

export const useRowSelection = function <RowType extends object>({columns, dataSource, rowSelection, rowKey}: Props<RowType>) {
    const transformedColumns = React.useMemo(() => {
        if (!rowSelection) {
            return [...columns];
        }

        const {width, onChange, selectedRowKeys, fixed, disableSelectAll, disableSelection, title} = rowSelection;

        const onSelectAll = (val: boolean) => {
            const allSelectedRowKeys = dataSource.map((_, idx) => (rowKey === "index" ? idx : _[rowKey]));
            val ? onChange(allSelectedRowKeys, dataSource) : onChange([], []);
        };

        const rowSelectionColumn: VirtualTableColumn<RowType> = {
            width,
            fixed: fixed ? "left" : undefined,
            title: title || (
                <Checkbox
                    disabled={disableSelectAll || dataSource.length === 0}
                    indeterminate={selectedRowKeys.length >= 1 && selectedRowKeys.length !== dataSource.length}
                    onChange={onSelectAll}
                    value={dataSource.length !== 0 && selectedRowKeys ? selectedRowKeys.length === dataSource.length : false}
                />
            ),
            renderData: (data, rowIndex) => {
                const dataKey = rowKey === "index" ? rowIndex : data[rowKey];
                const isChecked = selectedRowKeys.includes(dataKey);
                const toggledSelectedRowKeys = ArrayUtil.toggleElement(selectedRowKeys, dataKey);
                return (
                    <Checkbox
                        disabled={disableSelection?.(data, rowIndex)}
                        value={isChecked}
                        onChange={() =>
                            onChange(
                                toggledSelectedRowKeys,
                                dataSource.filter((_, idx) => toggledSelectedRowKeys.includes(rowKey ? _[rowKey] : idx))
                            )
                        }
                    />
                );
            },
        };

        return [rowSelectionColumn, ...columns];
    }, [columns, dataSource, rowKey, rowSelection]);

    return transformedColumns;
};
