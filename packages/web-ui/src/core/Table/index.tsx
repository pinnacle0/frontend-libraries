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
import type {ColumnProps as AntColumnsProps, TableProps as AntTableProps} from "antd/es/table";
import type {TableRowSelection} from "antd/es/table/interface";
import type {StringKey} from "../../internal/type";
import {ReactUtil} from "../../util/ReactUtil";

enum SortOrder {
    DESC = "DESC",
    ASC = "ASC",
}

type RenderedCell<T extends object> = Exclude<ReturnType<NonNullable<AntColumnsProps<T>["render"]>>, React.ReactNode>;

export type {TableRowSelection};

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
    hidden?: boolean;
    customizedKey?: string;
    onCell?: (data: RowType, index?: number) => React.HTMLAttributes<any> | React.TdHTMLAttributes<any>;
}

export type TableColumns<RowType extends object, OrderByFieldType = undefined> = Array<TableColumn<RowType, OrderByFieldType>>;

export interface TableSorter<OrderByFieldType = undefined> {
    currentOrder: SortOrder;
    onSortChange: (sortOrder: SortOrder, orderBy: OrderByFieldType | undefined) => void;
    currentOrderBy?: OrderByFieldType; // This may be undefined if the table supports only 1 sort field
}

export interface TableProps<RowType extends object, OrderByFieldType> extends Omit<AntTableProps<RowType>, "scroll" | "locale" | "virtual"> {
    columns: TableColumns<RowType, OrderByFieldType>;
    dataSource: RowType[];
    /**
     * Attention:
     * Use {rowKey: "index"} only if you are certain that the data source is immutable.
     */
    rowKey: StringKey<RowType> | ((record: RowType, index?: number) => string) | "index";
    // onRowClick will override the return props from onRow
    onRowClick?: (record: RowType, index?: number) => void;
    scrollX?: string | number;
    scrollY?: string | number;
    loading?: boolean;
    // if emptyPlaceholder is provided, emptyIcon and emptyText will be ignored
    emptyPlaceholder?: React.ReactElement | string | number;
    emptyIcon?: React.ReactElement | string | number;
    emptyText?: string;
    emptyNodeStyle?: React.CSSProperties;
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
    minHeaderHeight?: number;
}

interface CustomizationConfig {
    [key: string]: boolean;
}

const emptyPlaceHolderContainerStyle: React.CSSProperties = {padding: "50px 0"};
const emptyPlaceHolderIconStyle: React.CSSProperties = {display: "block", fontSize: 50, marginBottom: 20};
const settingIconContainerStyle: React.CSSProperties = {display: "flex", justifyContent: "flex-end", marginBottom: "7px", marginRight: "5px"};
const settingIconStyle: React.CSSProperties = {fontSize: "20px"};

export const Table = ReactUtil.memo("Table", <RowType extends object, OrderByFieldType>(props: TableProps<RowType, OrderByFieldType>) => {
    const {
        sortConfig,
        loading,
        columns,
        onRow,
        onRowClick,
        rowKey,
        scrollX = "max-content",
        scrollY,
        emptyPlaceholder,
        emptyIcon,
        emptyText,
        emptyNodeStyle,
        dataSource,
        customizedStorageKey,
        minHeaderHeight,
        ...restProps
    } = props;
    const [customizationConfig, setCustomizationConfig] = React.useState<CustomizationConfig>(getCustomizationConfig(props, getStorageKey(customizedStorageKey)));
    const t = i18n();

    const hasUniqueSortingColumn = () => columns.some(_ => _.sortField === true);

    const rowKeyByIndex = (record: RowType) => dataSource.indexOf(record);

    const transformColumns = (originalColumn: TableColumn<RowType, OrderByFieldType>, index: number): AntColumnsProps<RowType> => {
        const {renderData, onHeaderClick, ...restColumnProps} = originalColumn;
        const customizedKey = originalColumn.customizedKey;
        return {
            // Ant Table requires key when enabling sorting, using column index here
            key: index.toString(),
            onHeaderCell: () => ({onClick: onHeaderClick, style: {minHeight: minHeaderHeight}}),
            render: (_: any, record: RowType, index: number) => renderData(record, index),
            hidden: originalColumn.hidden || (customizedKey ? customizationConfig[customizedKey] === false : false),
            ...restColumnProps,
        };
    };

    const onCustomizationConfigChange = (value: boolean, key: string) => {
        const newConfig = {...customizationConfig, [key]: value};
        setCustomizationConfig(newConfig);
        LocalStorageUtil.setObject(getStorageKey(customizedStorageKey), newConfig);
    };

    const onSortChange = (_1: any, _2: any, sorter: {} | {order: "descend" | "ascend"; column: TableColumn<RowType, OrderByFieldType>}) => {
        if (sortConfig) {
            if (!("column" in sorter && sorter.column !== undefined) || !("sortField" in sorter.column) || hasUniqueSortingColumn()) {
                // AntD sorter here may be {}, if clicking on the header 3rd time (ASC -> DESC -> undefined);
                sortConfig.onSortChange(sortConfig.currentOrder === SortOrder.ASC ? SortOrder.DESC : SortOrder.ASC, sortConfig.currentOrderBy);
            } else {
                const sortField = sorter.column.sortField as OrderByFieldType;
                sortConfig.onSortChange(sorter.order === "ascend" ? SortOrder.ASC : SortOrder.DESC, sortField);
            }
        }
    };

    const onAntRow = (record: RowType, index?: number) => {
        const rowProps: React.HTMLAttributes<any> & React.TdHTMLAttributes<any> = onRow ? onRow(record, index) : {};
        onRowClick && (rowProps.onClick = () => onRowClick(record, index));
        return rowProps;
    };

    const renderPopoverContent = () => {
        return columns
            .filter(_ => _.customizedKey && !_.hidden)
            .map((_, index) => (
                <div key={index}>
                    <Checkbox value={customizationConfig[_.customizedKey!] !== false} onChange={checked => onCustomizationConfigChange(checked, _.customizedKey!)}>
                        {_.title}
                    </Checkbox>
                </div>
            ));
    };

    const emptyTextNode = loading ? (
        <div />
    ) : (
        <div className="empty-text-node" style={{...emptyPlaceHolderContainerStyle, ...emptyNodeStyle}}>
            {emptyPlaceholder || (
                <React.Fragment>
                    {emptyIcon || <FileSearchOutlined style={emptyPlaceHolderIconStyle} />}
                    <h2>{emptyText || t.emptyData}</h2>
                </React.Fragment>
            )}
        </div>
    );

    let tableColumns: Array<AntColumnsProps<RowType>>;
    if (sortConfig) {
        const sortOrder: "ascend" | "descend" = sortConfig.currentOrder === SortOrder.ASC ? "ascend" : "descend";
        tableColumns = columns.map((column: TableColumn<RowType, OrderByFieldType>, index: number): AntColumnsProps<RowType> => {
            if (column.sortField) {
                const isSortingColumn = column.sortField === true || sortConfig.currentOrderBy === column.sortField;
                return {
                    ...transformColumns(column, index),
                    sorter: true,
                    sortOrder: isSortingColumn ? sortOrder : null,
                    sortDirections: ["descend", "ascend"],
                };
            } else {
                return transformColumns(column, index);
            }
        });
    } else {
        tableColumns = columns.map(transformColumns);
    }

    const canCustomized = Object.keys(customizationConfig).length > 0;
    return (
        <React.Fragment>
            {canCustomized && (
                <div style={settingIconContainerStyle}>
                    <Popover trigger="hover" placement="bottomLeft" content={renderPopoverContent()}>
                        <SettingOutlined style={settingIconStyle} />
                    </Popover>
                </div>
            )}
            <AntTable
                dataSource={dataSource}
                tableLayout="auto"
                locale={{emptyText: emptyTextNode}}
                onRow={onAntRow}
                loading={loading ? {indicator: <LoadingOutlined />} : false}
                pagination={false}
                columns={tableColumns}
                onChange={onSortChange}
                rowKey={rowKey === "index" ? rowKeyByIndex : rowKey}
                scroll={{x: scrollX === "none" ? undefined : scrollX, y: scrollY === "none" ? undefined : scrollY}}
                {...restProps}
            />
        </React.Fragment>
    );
});

const getStorageKey = (customizedStorageKey?: string) => `table-customization-config:${customizedStorageKey || location.pathname}`;

const getCustomizationConfig = <RowType extends object, OrderByFieldType>(props: TableProps<RowType, OrderByFieldType>, storageKey: string) => {
    const columnsCustomizedKeyList = ArrayUtil.compactMap(props.columns, _ => _.customizedKey || null);
    const defaultConfig = ArrayUtil.toObject(columnsCustomizedKeyList, key => [key, true]);
    return LocalStorageUtil.getObject(
        storageKey,
        defaultConfig,
        item => typeof item === "object" && !Array.isArray(item) && columnsCustomizedKeyList.some(_ => (item as Record<string, any>)[_] !== undefined)
    );
};
