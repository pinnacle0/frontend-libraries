import React from "react";
import RcTable from "@rc-component/table";
import "@rc-component/table/assets/index.css";
import "@rc-component/checkbox/assets/index.css";
import type {ColumnType as RcColumnType, TableProps as RcTableProps} from "@rc-component/table";
import {FileSearchOutlined, LoadingOutlined, SettingOutlined} from "../../internal/icons";
import {i18n} from "../../internal/i18n/core";
import {Checkbox} from "../Checkbox";
import {Popover} from "../Popover";
import {ArrayUtil} from "../../internal/ArrayUtil";
import {LocalStorageUtil} from "../../util/LocalStorageUtil";
import type {StringKey} from "../../internal/type";
import {ReactUtil} from "../../util/ReactUtil";

enum SortOrder {
    DESC = "DESC",
    ASC = "ASC",
}

type RenderedCell = {children: React.ReactNode; props?: React.TdHTMLAttributes<HTMLTableCellElement>};

export interface TableRowSelection<T extends object> {
    type?: "checkbox" | "radio";
    selectedRowKeys?: React.Key[];
    onChange?: (selectedRowKeys: React.Key[], selectedRows: T[]) => void;
    getCheckboxProps?: (record: T) => Partial<{disabled: boolean; name: string}>;
    fixed?: boolean;
    columnWidth?: string | number;
    columnTitle?: React.ReactNode;
    renderCell?: (checked: boolean, record: T, index: number, originNode: React.ReactNode) => React.ReactNode;
}

export interface TableHandler {
    scrollTo: (index: number) => void;
}

export interface TableColumn<RowType extends object, OrderByFieldType = undefined> {
    title: React.ReactElement | string | number;
    renderData: (record: RowType, index: number) => React.ReactNode | RenderedCell | undefined;
    align?: "left" | "right" | "center";
    colSpan?: number;
    width?: string | number;
    className?: string;
    fixed?: "left" | "right";
    sortField?: OrderByFieldType | true;
    onHeaderClick?: () => void;
    hidden?: boolean;
    customizedKey?: string | {key: string; defaultValue: boolean};
    onCell?: (data: RowType, index?: number) => React.HTMLAttributes<any> | React.TdHTMLAttributes<any>;
}

export type TableColumns<RowType extends object, OrderByFieldType = undefined> = Array<TableColumn<RowType, OrderByFieldType>>;

export interface TableSorter<OrderByFieldType = undefined> {
    currentOrder: SortOrder;
    onSortChange: (sortOrder: SortOrder, orderBy: OrderByFieldType | undefined) => void;
    currentOrderBy?: OrderByFieldType;
}

export interface TableProps<RowType extends object, OrderByFieldType> extends Omit<RcTableProps<RowType>, "scroll" | "locale" | "columns" | "data"> {
    columns: TableColumns<RowType, OrderByFieldType>;
    dataSource: RowType[];
    rowKey: StringKey<RowType> | ((record: RowType, index?: number) => string) | "index";
    onRowClick?: (record: RowType, index?: number) => void;
    scrollX?: string | number;
    scrollY?: string | number;
    loading?: boolean;
    emptyPlaceholder?: React.ReactElement | string | number;
    emptyIcon?: React.ReactElement | string | number;
    emptyText?: string;
    emptyNodeStyle?: React.CSSProperties;
    sortConfig?: TableSorter<OrderByFieldType>;
    shouldRenderIfUpdate?: any;
    customizedStorageKey?: string;
    minHeaderHeight?: number;
    tableRef?: React.Ref<TableHandler>;
    rowSelection?: TableRowSelection<RowType>;
    onRow?: (record: RowType, index?: number) => React.HTMLAttributes<any>;
    pagination?: false;
    className?: string;
    style?: React.CSSProperties;
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
        tableRef,
        ...restProps
    } = props;
    const [customizationConfig, setCustomizationConfig] = React.useState<CustomizationConfig>(getCustomizationConfig(props, getStorageKey(customizedStorageKey)));
    const t = i18n();
    const tableContainerRef = React.useRef<HTMLDivElement>(null);

    React.useImperativeHandle(tableRef, () => ({
        scrollTo: (index: number) => {
            const rowHeight = tableContainerRef.current?.querySelector("tr.rc-table-row")?.getBoundingClientRect().height;
            if (rowHeight) {
                const scrollBody = tableContainerRef.current?.querySelector(".rc-table-body");
                if (scrollBody) scrollBody.scrollTop = rowHeight * index;
            }
        },
    }));

    const hasUniqueSortingColumn = () => columns.some(_ => _.sortField === true);
    const rowKeyByIndex = (record: RowType) => dataSource.indexOf(record);

    const transformColumns = (originalColumn: TableColumn<RowType, OrderByFieldType>, index: number): RcColumnType<RowType> => {
        const {renderData, onHeaderClick, sortField, ...restColumnProps} = originalColumn;
        const customizedKey = originalColumn.customizedKey;
        return {
            key: index.toString(),
            onHeaderCell: () => ({onClick: onHeaderClick, style: {minHeight: minHeaderHeight, cursor: sortField ? "pointer" : undefined}}) as any,
            render: (_: any, record: RowType, index: number) => renderData(record, index),
            hidden: originalColumn.hidden || (customizedKey ? customizationConfig[typeof customizedKey === "string" ? customizedKey : customizedKey.key] === false : false),
            ...restColumnProps,
        };
    };

    const onCustomizationConfigChange = (value: boolean, key: string) => {
        const newConfig = {...customizationConfig, [key]: value};
        setCustomizationConfig(newConfig);
        LocalStorageUtil.setObject(getStorageKey(customizedStorageKey), newConfig);
    };

    const onSortChange = (column: TableColumn<RowType, OrderByFieldType>) => {
        if (sortConfig && column.sortField) {
            if (column.sortField === true || hasUniqueSortingColumn()) {
                sortConfig.onSortChange(sortConfig.currentOrder === SortOrder.ASC ? SortOrder.DESC : SortOrder.ASC, sortConfig.currentOrderBy);
            } else {
                const sortField = column.sortField as OrderByFieldType;
                const newOrder = sortConfig.currentOrderBy === sortField ? (sortConfig.currentOrder === SortOrder.ASC ? SortOrder.DESC : SortOrder.ASC) : SortOrder.ASC;
                sortConfig.onSortChange(newOrder, sortField);
            }
        }
    };

    const onRcRow = (record: RowType, index?: number) => {
        const rowProps: React.HTMLAttributes<any> & React.TdHTMLAttributes<any> = onRow ? onRow(record, index) : {};
        onRowClick && (rowProps.onClick = () => onRowClick(record, index));
        return rowProps;
    };

    const renderPopoverContent = () => {
        return columns
            .filter(_ => _.customizedKey && !_.hidden)
            .map((_, index) => {
                const customizedKey = typeof _.customizedKey === "string" ? _.customizedKey : _.customizedKey!.key;
                return (
                    <div key={index}>
                        <Checkbox value={customizationConfig[customizedKey] !== false} onChange={checked => onCustomizationConfigChange(checked, customizedKey)}>
                            {_.title}
                        </Checkbox>
                    </div>
                );
            });
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

    const tableColumns: Array<RcColumnType<RowType>> = columns.map((column, index) => {
        const base = transformColumns(column, index);
        if (sortConfig && column.sortField) {
            const isSortingColumn = column.sortField === true || sortConfig.currentOrderBy === column.sortField;
            const sortOrder = sortConfig.currentOrder === SortOrder.ASC ? "↑" : "↓";
            return {
                ...base,
                title: (
                    <span onClick={() => onSortChange(column)} style={{cursor: "pointer"}}>
                        {column.title} {isSortingColumn ? sortOrder : ""}
                    </span>
                ),
            };
        }
        return base;
    });

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
            <div ref={tableContainerRef} style={{position: "relative"}}>
                {loading && (
                    <div style={{position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(255,255,255,0.65)", zIndex: 4}}>
                        <LoadingOutlined />
                    </div>
                )}
                <RcTable
                    data={dataSource}
                    columns={tableColumns.filter(c => !c.hidden)}
                    rowKey={rowKey === "index" ? rowKeyByIndex : rowKey}
                    scroll={{x: scrollX === "none" ? undefined : scrollX, y: scrollY === "none" ? undefined : scrollY}}
                    onRow={onRcRow}
                    emptyText={emptyTextNode}
                    {...restProps}
                />
            </div>
        </React.Fragment>
    );
});

const getStorageKey = (customizedStorageKey?: string) => `table-customization-config:${customizedStorageKey || location.pathname}`;

const getCustomizationConfig = <RowType extends object, OrderByFieldType>(props: TableProps<RowType, OrderByFieldType>, storageKey: string) => {
    const columnsCustomizedKeyList = ArrayUtil.compactMap(props.columns, _ => _.customizedKey || null);
    const defaultConfig = ArrayUtil.toObject(columnsCustomizedKeyList, key => [typeof key === "string" ? key : key.key, typeof key === "string" ? true : key.defaultValue]);
    return LocalStorageUtil.getObject(
        storageKey,
        defaultConfig,
        item => typeof item === "object" && !Array.isArray(item) && columnsCustomizedKeyList.some(_ => (item as Record<string, any>)[typeof _ === "string" ? _ : _.key] !== undefined)
    );
};
