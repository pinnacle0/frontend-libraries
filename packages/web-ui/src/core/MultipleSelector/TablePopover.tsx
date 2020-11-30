import React from "react";
import {ControlledFormValue} from "../../internal/type";
import {Table, TableColumns, TableRowSelection} from "../Table";

interface Props<RowType extends object> extends ControlledFormValue<RowType[]> {
    dataSource: RowType[];
    columns: TableColumns<RowType>;
    rowKeyExtractor: (record: RowType) => string;
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

    onChange = (newSelectedKeys: string[]) => {
        const {value, dataSource, onChange, rowKeyExtractor} = this.props;
        const prevSelectedKeys = value.map(rowKeyExtractor);
        const newSelectedItems = newSelectedKeys
            .filter(_ => !prevSelectedKeys.includes(_))
            // By Ant Design, Parameter `newSelectedKeys` must exist in current data source
            .map(key => dataSource.find(_ => rowKeyExtractor(_) === key)!);
        if (newSelectedItems.length > 0) {
            // Select
            onChange([...value, ...newSelectedItems]);
        } else {
            // Deselect
            const dataSourceKeys = dataSource.map(rowKeyExtractor);
            const deletedItems = value.filter(_ => {
                const key = rowKeyExtractor(_);
                return !newSelectedKeys.includes(key) && dataSourceKeys.includes(key);
            });
            const withoutDeletedItems = value.filter(_ => !deletedItems.includes(_));
            onChange(withoutDeletedItems);
        }
    };

    render() {
        const {dataSource, rowKeyExtractor, columns, children, selectionDisabled, scrollY, value} = this.props;
        const selectedRowKeys = value.map(rowKeyExtractor);
        const rowSelection: TableRowSelection<RowType> | undefined = selectionDisabled
            ? undefined
            : {
                  selectedRowKeys,
                  onChange: this.onChange as (_: Array<string | number>) => void,
              };
        const table = <Table rowSelection={rowSelection} size="small" dataSource={dataSource} columns={columns} rowKey={rowKeyExtractor} scrollY={scrollY} scrollX="none" />;
        return <div className="g-multiple-selector-table-popover">{children ? children(table) : table}</div>;
    }
}
