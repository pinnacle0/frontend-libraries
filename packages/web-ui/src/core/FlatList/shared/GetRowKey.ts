import type {RowKey} from "../type";

export function GetRowKey<T>(rowKey: RowKey<T>, data: T, index: number): string | number {
    if (rowKey === "index") {
        return index;
    } else if (typeof rowKey === "function") {
        return rowKey(data, index);
    } else {
        return data[rowKey] as any;
    }
}
