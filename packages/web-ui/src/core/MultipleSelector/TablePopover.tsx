import React from "react";
import type {ControlledFormValue, StringKey} from "../../internal/type";
import type {TableColumns, TableRowSelection} from "../Table";
import {Table} from "../Table";

interface Props<RowType extends object> extends ControlledFormValue<RowType[]> {
    dataSource: RowType[];
    columns: TableColumns<RowType>;
    rowKey: StringKey<RowType> | ((record: RowType) => string);
    scrollY: number;
    children?: (table: React.ReactElement) => React.ReactElement;
    onFirstRender?: () => void;
    selectionDisabled?: boolean;
}

export class TablePopover<RowType extends object> extends React.PureComponent<Props<RowType>> {
    static displayName = "TablePopover";

    componentDidMount() {
        this.props.onFirstRender?.();
    }

    rowKey = (item: RowType): string => {
        const {rowKey} = this.props;
        return typeof rowKey === "function" ? rowKey(item) : (item[rowKey] as any);
    };

    onChange = (newSelectedKeys: string[]) => {
        const {value, dataSource, onChange} = this.props;
        const prevSelectedKeys = value.map(this.rowKey);
        const newSelectedItems = newSelectedKeys
            .filter(_ => !prevSelectedKeys.includes(_))
            // By Ant Design, Parameter `newSelectedKeys` must exist in current data source
            .map(key => dataSource.find(_ => this.rowKey(_) === key)!);
        if (newSelectedItems.length > 0) {
            // Select
            onChange([...value, ...newSelectedItems]);
        } else {
            // Deselect
            const dataSourceKeys = dataSource.map(this.rowKey);
            const deletedItems = value.filter(_ => {
                const key = this.rowKey(_);
                return !newSelectedKeys.includes(key) && dataSourceKeys.includes(key);
            });
            const withoutDeletedItems = value.filter(_ => !deletedItems.includes(_));
            onChange(withoutDeletedItems);
        }
    };

    render() {
        const {dataSource, rowKey, columns, children, selectionDisabled, scrollY, value} = this.props;
        const selectedRowKeys = value.map(this.rowKey);
        const rowSelection: TableRowSelection<RowType> | undefined = selectionDisabled
            ? undefined
            : {
                  selectedRowKeys,
                  onChange: this.onChange as (_: React.Key[]) => void,
              };
        const table = <Table rowSelection={rowSelection} size="small" dataSource={dataSource} columns={columns} rowKey={rowKey} scrollY={scrollY} scrollX="none" />;
        return <div className="g-multiple-selector-table-popover">{children ? children(table) : table}</div>;
    }
}
