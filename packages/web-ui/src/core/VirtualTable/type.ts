export type ColumnFixedPosition = "left" | "right";

export interface StickyPosition {
    value: number;
    isLast: boolean;
}

/**
 * Similar usage of Antd Table but only support partial features: fixed columns, row selection, on row click
 */
export type VirtualTableRowSelection<RowType extends object> = {
    width: number;
    selectedRowKeys: React.Key[];
    onChange: (selectedRowKeys: React.Key[], selectedRows: RowType[]) => void;
    /**
     * Can only sticky in left
     */
    fixed?: boolean;
    isDisabled?: (data: RowType, rowIndex: number) => boolean;
    isSelectAllDisabled?: boolean;
    /**
     * Attention:
     * If title is provided, the select all checkbox wil be overridden
     */
    title?: React.ReactNode | string | number;
};

export type VirtualTableColumn<RowType extends object> = {
    title: React.ReactNode | string | number;
    width: number;
    /**
     * Attention:
     * If renderData return null, the corresponding table cell will not render
     */
    renderData: (record: RowType, rowIndex: number) => React.ReactNode | undefined;
    align?: "left" | "right" | "center";
    display?: "default" | "hidden";
    fixed?: "left" | "right";
    /**
     * Attention:
     * The overridden cell should return null in renderData props:
     * e.g. [{colSpan: 3, renderData: () => <div />}, {renderData: () => null}], {renderData: () => null}
     */
    colSpan?: (record: RowType, rowIndex: number, colIndex: number) => number;
};
