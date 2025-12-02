import React from "react";
import type {ControlledFormValue, StringKey} from "../../internal/type";
import type {TableColumns, TableRowSelection} from "../Table";
import {Table} from "../Table";
import {ReactUtil} from "../../util/ReactUtil";
import {useDidMountEffect} from "../../hooks/useDidMountEffect";

interface Props<RowType extends object> extends ControlledFormValue<RowType[]> {
    dataSource: RowType[];
    columns: TableColumns<RowType>;
    rowKey: StringKey<RowType> | ((record: RowType) => string);
    scrollY: number;
    children?: (table: React.ReactElement) => React.ReactElement;
    onFirstRender?: () => void;
    selectionDisabled?: boolean;
}

export const TablePopover = ReactUtil.memo("TablePopover", <RowType extends object>(props: Props<RowType>) => {
    const {dataSource, rowKey, columns, children, selectionDisabled, scrollY, value, onFirstRender, onChange} = props;

    useDidMountEffect(() => {
        onFirstRender?.();
    });

    const getRowKey = (item: RowType): string => {
        return typeof rowKey === "function" ? rowKey(item) : (item[rowKey] as any);
    };

    const onAntChange = (newSelectedKeys: string[]) => {
        const prevSelectedKeys = value.map(getRowKey);
        const newSelectedItems = newSelectedKeys
            .filter(_ => !prevSelectedKeys.includes(_))
            // By Ant Design, Parameter `newSelectedKeys` must exist in current data source
            .map(key => dataSource.find(_ => getRowKey(_) === key)!);
        if (newSelectedItems.length > 0) {
            // Select
            onChange([...value, ...newSelectedItems]);
        } else {
            // Deselect
            const dataSourceKeys = dataSource.map(getRowKey);
            const deletedItems = value.filter(_ => {
                const key = getRowKey(_);
                return !newSelectedKeys.includes(key) && dataSourceKeys.includes(key);
            });
            const withoutDeletedItems = value.filter(_ => !deletedItems.includes(_));
            onChange(withoutDeletedItems);
        }
    };

    const selectedRowKeys = value.map(getRowKey);
    const rowSelection: TableRowSelection<RowType> | undefined = selectionDisabled
        ? undefined
        : {
              selectedRowKeys,
              onChange: onAntChange as (_: React.Key[]) => void,
          };
    const table = <Table rowSelection={rowSelection} size="small" dataSource={dataSource} columns={columns} rowKey={rowKey} scrollY={scrollY} scrollX="none" />;
    return <div className="g-multiple-selector-table-popover">{children ? children(table) : table}</div>;
});
