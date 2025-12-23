import type {TableColumn, TableProps} from "../Table";

export interface TableColumnWithWidth<RowType extends object> extends Omit<TableColumn<RowType>, "width"> {
    width: number;
}

export type VirtualTableColumns<RowType extends object, UseScrollX = false> = UseScrollX extends true ? TableColumn<RowType>[] : TableColumnWithWidth<RowType>[];

interface VirtualTableBaseProps<RowType extends object> extends Omit<TableProps<RowType, undefined>, "columns" | "scrollX" | "scrollY"> {
    width?: number | string;
    scrollY?: number;
}

export interface VirtualTablePropsWithScrollX<RowType extends object> extends VirtualTableBaseProps<RowType> {
    columns: VirtualTableColumns<RowType, true>;
    scrollX: number;
}

export interface VirtualTablePropsWithColumnWidth<RowType extends object> extends VirtualTableBaseProps<RowType> {
    columns: VirtualTableColumns<RowType, false>;
}

export type VirtualTableProps<RowType extends object> = VirtualTablePropsWithScrollX<RowType> | VirtualTablePropsWithColumnWidth<RowType>;
