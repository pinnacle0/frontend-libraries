import AntTable, {ColumnProps as AntColumnsProps, TableProps as AntTableProps} from "antd/lib/table";
import {TableRowSelection} from "antd/lib/table/interface";
import "antd/lib/table/style";
import React from "react";
import FileSearchOutlined from "@ant-design/icons/FileSearchOutlined";
import LoadingOutlined from "@ant-design/icons/LoadingOutlined";
import {PickOptional, StringKey} from "../../internal/type";
import {i18n} from "../../internal/i18n/core";
import {RenderedCell} from "rc-table/lib/interface";
import "./index.less";

enum SortOrder {
    DESC = "DESC",
    ASC = "ASC",
}

export interface TableColumn<RowType extends object, OrderByFieldType = undefined> {
    title: React.ReactElement | React.ReactChild;
    renderData: (record: RowType, index: number) => React.ReactElement | React.ReactChild | RenderedCell<RowType> | null | boolean | undefined; // Using name render leads to type incompatibility
    align?: "left" | "right" | "center";
    colSpan?: number;
    width?: string | number;
    className?: string;
    fixed?: "left" | "right";
    sortField?: OrderByFieldType | true; // True is used for only 1 columns sorting
    onHeaderClick?: () => void;
    // TODO/yuen: display?: "default" | "hidden"
    hideIf?: boolean;
}

export type TableColumns<RowType extends object, OrderByFieldType = undefined> = Array<TableColumn<RowType, OrderByFieldType>>;

export interface TableSorter<OrderByFieldType = undefined> {
    currentOrder: SortOrder;
    onSortChange: (sortOrder: SortOrder, orderBy: OrderByFieldType | undefined) => void;
    currentOrderBy?: OrderByFieldType; // This may be undefined if the table supports only 1 sort field
}

export interface TableProps<RowType extends object, OrderByFieldType> extends Omit<AntTableProps<RowType>, "onRow" | "scroll" | "locale"> {
    columns: TableColumns<RowType, OrderByFieldType>;
    dataSource: RowType[];
    /**
     * Attention:
     * Use {rowKey: "index"} only if you are certain that the data source is immutable.
     */
    rowKey: StringKey<RowType> | ((record: RowType, index?: number) => string) | "index";
    onRowClick?: (record: RowType, index?: number) => void;
    scrollX?: "max-content" | "none" | number;
    scrollY?: number;
    loading?: boolean;
    emptyText?: string;
    sortConfig?: TableSorter<OrderByFieldType>;
    /**
     * Just adding to props, without any usage, so that it could trigger re-render when it changes.
     * A similar API is: https://facebook.github.io/react-native/docs/flatlist#extradata
     */
    shouldRenderIfUpdate?: any;
}

export class Table<RowType extends object, OrderByFieldType> extends React.PureComponent<TableProps<RowType, OrderByFieldType>> {
    static displayName = "Table";
    static defaultProps: PickOptional<TableProps<any, any>> = {
        scrollX: "max-content",
    };

    private readonly emptyPlaceHolderContainerStyle: React.CSSProperties = {padding: "50px 0"};
    private readonly emptyPlaceHolderIconStyle: React.CSSProperties = {display: "block", fontSize: 50, marginBottom: 20};

    hasUniqueSortingColumn = () => this.props.columns.some(_ => _.sortField === true);

    rowKeyByIndex = (record: RowType) => this.props.dataSource.indexOf(record);

    transformColumns = (column: TableColumn<RowType, OrderByFieldType>, index: number): AntColumnsProps<RowType> => {
        const {renderData, onHeaderClick, ...restColumnProps} = column;
        return {
            // Ant Table requires key when enabling sorting, using column index here
            key: index.toString(),
            onHeaderCell: onHeaderClick ? () => ({onClick: onHeaderClick}) : undefined,
            render: (data: any, record: RowType, index: number) => renderData(record, index),
            ...restColumnProps,
        };
    };

    onSortChange = (_1: any, _2: any, sorter: {} | {order: "descend" | "ascend"; column: TableColumn<RowType, OrderByFieldType>}) => {
        const {sortConfig} = this.props;
        if (sortConfig) {
            if (!("column" in sorter && sorter.column !== undefined) || !("sortField" in sorter.column) || this.hasUniqueSortingColumn()) {
                // AntD sorter here may be {}, if clicking on the header 3rd time (ASC -> DESC -> undefined);
                sortConfig.onSortChange(sortConfig.currentOrder === SortOrder.ASC ? SortOrder.DESC : SortOrder.ASC, sortConfig.currentOrderBy);
            } else {
                const sortField = sorter.column.sortField as OrderByFieldType;
                sortConfig.onSortChange(sorter.order === "ascend" ? SortOrder.ASC : SortOrder.DESC, sortField);
            }
        }
    };

    onRow = (record: RowType, index?: number) => {
        const {onRowClick} = this.props;
        return onRowClick
            ? {
                  onClick: () => onRowClick(record, index),
              }
            : {};
    };

    render() {
        // Exclude onRowClick from restProps, because onRowClick also exists in Ant Table props, which is depreciated though
        const {sortConfig, loading, columns, onRowClick, rowKey, scrollX, scrollY, emptyText, ...restProps} = this.props;
        const t = i18n();
        const emptyTextNode = loading ? (
            <div />
        ) : (
            <div style={this.emptyPlaceHolderContainerStyle}>
                <FileSearchOutlined style={this.emptyPlaceHolderIconStyle} />
                <h2>{emptyText || t.emptyData}</h2>
            </div>
        );

        const filteredColumns = columns.filter(_ => _.hideIf !== true);
        let tableColumns: Array<AntColumnsProps<RowType>>;
        if (sortConfig) {
            const sortOrder: "ascend" | "descend" = sortConfig.currentOrder === SortOrder.ASC ? "ascend" : "descend";
            tableColumns = filteredColumns.map(
                (column: TableColumn<RowType, OrderByFieldType>, index: number): AntColumnsProps<RowType> => {
                    if (column.sortField) {
                        const isSortingColumn = column.sortField === true || sortConfig.currentOrderBy === column.sortField;
                        return {
                            ...this.transformColumns(column, index),
                            sorter: true,
                            sortOrder: isSortingColumn ? sortOrder : null,
                        };
                    } else {
                        return this.transformColumns(column, index);
                    }
                }
            );
        } else {
            tableColumns = filteredColumns.map(this.transformColumns);
        }

        return (
            <AntTable
                tableLayout="auto"
                locale={{emptyText: emptyTextNode}}
                onRow={this.onRow}
                loading={loading ? {indicator: <LoadingOutlined />} : false}
                pagination={false}
                columns={tableColumns}
                onChange={this.onSortChange}
                rowKey={rowKey === "index" ? this.rowKeyByIndex : rowKey}
                scroll={{x: scrollX === "none" ? undefined : scrollX, y: scrollY}}
                {...restProps}
            />
        );
    }
}

export type {TableRowSelection};
