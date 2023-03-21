import React from "react";
import AntTable from "antd/es/table";
import FileSearchOutlined from "@ant-design/icons/FileSearchOutlined";
import LoadingOutlined from "@ant-design/icons/LoadingOutlined";
import SettingOutlined from "@ant-design/icons/SettingOutlined";
import {i18n} from "../../internal/i18n/core";
import {Checkbox} from "../Checkbox";
import {Popover} from "../Popover";
import {ArrayUtil} from "../../internal/ArrayUtil";
import {LocalStorageUtil} from "../../util/LocalStorageUtil";
import "antd/es/table/style";
import "./index.less";
import type {ColumnProps as AntColumnsProps, TableProps as AntTableProps} from "antd/es/table";
import type {TableRowSelection} from "antd/es/table/interface";
import type {PickOptional, StringKey} from "../../internal/type";

enum SortOrder {
    DESC = "DESC",
    ASC = "ASC",
}

type RenderedCell<T extends object> = Exclude<ReturnType<NonNullable<AntColumnsProps<T>["render"]>>, React.ReactNode>;

export interface TableColumn<RowType extends object, OrderByFieldType = undefined> {
    title: React.ReactElement | string | number;
    renderData: (record: RowType, index: number) => React.ReactNode | RenderedCell<RowType> | undefined; // Using name render leads to type incompatibility
    align?: "left" | "right" | "center";
    colSpan?: number;
    width?: string | number;
    className?: string;
    fixed?: "left" | "right";
    sortField?: OrderByFieldType | true; // True is used for only 1 columns sorting
    onHeaderClick?: () => void;
    display?: "default" | "hidden";
    customizedKey?: string;
    onCell?: (data: RowType, index?: number) => React.HTMLAttributes<any> | React.TdHTMLAttributes<any>;
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
    // if emptyPlaceholder is provided, emptyIcon and emptyText will be ignored
    emptyPlaceholder?: React.ReactElement | string | number;
    emptyIcon?: React.ReactElement | string | number;
    emptyText?: string;
    sortConfig?: TableSorter<OrderByFieldType>;
    /**
     * Just adding to props, without any usage, so that it could trigger re-render when it changes.
     * A similar API is: https://facebook.github.io/react-native/docs/flatlist#extradata
     */
    shouldRenderIfUpdate?: any;
    /**
     * key for column customization
     */
    customizedStorageKey?: string;
}

interface State {
    customizationConfig: {[key: string]: boolean};
}

export class Table<RowType extends object, OrderByFieldType> extends React.PureComponent<TableProps<RowType, OrderByFieldType>, State> {
    static displayName = "Table";
    static defaultProps: PickOptional<TableProps<any, any>> = {
        scrollX: "max-content",
    };

    private readonly emptyPlaceHolderContainerStyle: React.CSSProperties = {padding: "50px 0"};
    private readonly emptyPlaceHolderIconStyle: React.CSSProperties = {display: "block", fontSize: 50, marginBottom: 20};
    private readonly settingIconContainerStyle: React.CSSProperties = {display: "flex", justifyContent: "flex-end", marginBottom: "7px", marginRight: "5px"};
    private readonly settingIconStyle: React.CSSProperties = {fontSize: "20px"};
    private readonly storageKey = `table-customization-config:${this.props.customizedStorageKey || location.pathname}`;
    private readonly canCustomized: boolean;

    constructor(props: TableProps<RowType, OrderByFieldType>) {
        super(props);
        const columnsCustomizedKeyList = ArrayUtil.compactMap(props.columns, _ => _.customizedKey || null);
        const defaultConfig = ArrayUtil.toObject(columnsCustomizedKeyList, key => [key, true]);
        const savedConfig = LocalStorageUtil.getObject(
            this.storageKey,
            defaultConfig,
            item => typeof item === "object" && !Array.isArray(item) && columnsCustomizedKeyList.some(_ => (item as Record<any, any>)[_] !== undefined)
        );

        this.canCustomized = Object.keys(defaultConfig).length > 0;
        this.state = {customizationConfig: savedConfig};
    }

    hasUniqueSortingColumn = () => this.props.columns.some(_ => _.sortField === true);

    rowKeyByIndex = (record: RowType) => this.props.dataSource.indexOf(record);

    transformColumns = (column: TableColumn<RowType, OrderByFieldType>, index: number): AntColumnsProps<RowType> => {
        const {renderData, onHeaderClick, ...restColumnProps} = column;
        return {
            // Ant Table requires key when enabling sorting, using column index here
            key: index.toString(),
            onHeaderCell: onHeaderClick ? () => ({onClick: onHeaderClick}) : undefined,
            render: (_: any, record: RowType, index: number) => renderData(record, index),
            ...restColumnProps,
        };
    };

    onCustomizationConfigChange = (value: boolean, key: string) => {
        const newConfig = {...this.state.customizationConfig, [key]: value};
        this.setState({customizationConfig: newConfig});
        LocalStorageUtil.setObject(this.storageKey, newConfig);
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

    renderPopoverContent = () => {
        const {columns} = this.props;
        const {customizationConfig} = this.state;
        return columns
            .filter(_ => _.customizedKey && _.display !== "hidden")
            .map((_, index) => (
                <div key={index}>
                    <Checkbox value={customizationConfig[_.customizedKey!] !== false} onChange={checked => this.onCustomizationConfigChange(checked, _.customizedKey!)}>
                        {_.title}
                    </Checkbox>
                </div>
            ));
    };

    render() {
        //
        const {
            sortConfig,
            loading,
            columns,
            // eslint-disable-next-line @typescript-eslint/no-unused-vars -- Exclude onRowClick from restProps, because onRowClick also exists in Ant Table props, which is depreciated though
            onRowClick,
            rowKey,
            scrollX,
            scrollY,
            emptyPlaceholder,
            emptyIcon,
            emptyText,
            ...restProps
        } = this.props;
        const t = i18n();
        const emptyTextNode = loading ? (
            <div />
        ) : (
            <div style={this.emptyPlaceHolderContainerStyle}>
                {emptyPlaceholder || (
                    <React.Fragment>
                        {emptyIcon || <FileSearchOutlined style={this.emptyPlaceHolderIconStyle} />}
                        <h2>{emptyText || t.emptyData}</h2>
                    </React.Fragment>
                )}
            </div>
        );

        const filteredColumns = columns.filter(_ => _.display !== "hidden" && (!_.customizedKey || this.state.customizationConfig[_.customizedKey] !== false));
        let tableColumns: Array<AntColumnsProps<RowType>>;
        if (sortConfig) {
            const sortOrder: "ascend" | "descend" = sortConfig.currentOrder === SortOrder.ASC ? "ascend" : "descend";
            tableColumns = filteredColumns.map((column: TableColumn<RowType, OrderByFieldType>, index: number): AntColumnsProps<RowType> => {
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
            });
        } else {
            tableColumns = filteredColumns.map(this.transformColumns);
        }

        return (
            <React.Fragment>
                {this.canCustomized && (
                    <div style={this.settingIconContainerStyle}>
                        <Popover trigger="hover" placement="bottomLeft" content={this.renderPopoverContent()}>
                            <SettingOutlined style={this.settingIconStyle} />
                        </Popover>
                    </div>
                )}
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
            </React.Fragment>
        );
    }
}

export type {TableRowSelection};
