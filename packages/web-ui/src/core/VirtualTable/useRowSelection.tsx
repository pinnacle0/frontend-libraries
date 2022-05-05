import React from "react";
import {Checkbox} from "../Checkbox";
import type {VirtualTableRowSelection, VirtualTableColumn} from "./index";

interface Props<RowType extends object> {
    columns: VirtualTableColumn<RowType>[];
    dataSource: RowType[];
    rowSelection?: VirtualTableRowSelection<RowType>;
    rowKey: "index" | React.Key;
}

interface RowStatus<RowType extends object> {
    isChecked: boolean;
    isDisabled: boolean;
    data: RowType;
}

export const useRowSelection = function <RowType extends object>({columns, dataSource, rowSelection, rowKey}: Props<RowType>) {
    const onChangeRef = React.useRef(rowSelection?.onChange);
    const [rowStatus, setRowStatus] = React.useState<Record<React.Key, RowStatus<RowType>>>(() => {
        const result: Record<React.Key, RowStatus<RowType>> = {};
        if (rowSelection) {
            const {selectedRowKeys, isDisabled} = rowSelection;

            dataSource.forEach((data, rowIndex) => {
                const key = rowKey === "index" ? rowIndex : data[rowKey];
                const isChecked = selectedRowKeys.findIndex(_ => _ === key) !== -1;
                const isDisabledRow = isDisabled?.(data, rowIndex) || false;

                result[key] = {
                    isChecked,
                    isDisabled: isDisabledRow,
                    data,
                };
            });
        }
        return result;
    });

    const onRowSelectClick = React.useCallback((rowKey: React.Key) => {
        setRowStatus(rowStatus => ({
            ...rowStatus,
            [rowKey]: {
                ...rowStatus[rowKey],
                isChecked: !rowStatus[rowKey].isChecked,
            },
        }));
    }, []);

    const onAllSelectClick = React.useCallback((val: boolean) => {
        setRowStatus(rowStatus => {
            const newStatus: Record<React.Key, RowStatus<RowType>> = {};
            Object.entries(rowStatus).forEach(([rowKey, status]) => {
                newStatus[rowKey] = {
                    ...status,
                    isChecked: val ? status.isChecked || !status.isDisabled : status.isChecked && status.isDisabled,
                };
            });
            return newStatus;
        });
    }, []);

    const selectionAllStatus = React.useMemo(() => {
        const allSelectionRowKeys: React.Key[] = [];
        const allSelectionRows: RowType[] = [];
        const unAllSelectionRowKeys: React.Key[] = [];
        const unAllSelectionRows: RowType[] = [];
        const enabledRowKeys: React.Key[] = [];
        const enabledCheckedRowKeys: React.Key[] = [];

        Object.entries(rowStatus).forEach(([rowKey, {isChecked, isDisabled, data}]) => {
            if (isDisabled) {
                if (isChecked) {
                    allSelectionRowKeys.push(rowKey);
                    allSelectionRows.push(data);
                    unAllSelectionRowKeys.push(rowKey);
                    unAllSelectionRows.push(data);
                }
            } else {
                enabledRowKeys.push(rowKey);
                isChecked && enabledCheckedRowKeys.push(rowKey);
                allSelectionRowKeys.push(rowKey);
                allSelectionRows.push(data);
            }
        });

        const isAllSelectionDisabled = rowSelection?.isSelectAllDisabled || enabledRowKeys.length === 0;
        const isAllSelected = enabledRowKeys.length === enabledCheckedRowKeys.length;
        const isIndeterminate = enabledCheckedRowKeys.length > 0 && !isAllSelected;

        return {
            isDisabled: isAllSelectionDisabled,
            isSelected: isAllSelected,
            isIndeterminate,
        };
    }, [rowSelection?.isSelectAllDisabled, rowStatus]);

    const transformedColumns = React.useMemo(() => {
        if (!rowSelection) {
            return [...columns];
        }

        const {width, fixed, isDisabled, title} = rowSelection;

        const rowSelectionColumn: VirtualTableColumn<RowType> = {
            width,
            fixed: fixed ? "left" : undefined,
            title: title || <Checkbox disabled={selectionAllStatus.isDisabled} indeterminate={selectionAllStatus.isIndeterminate} onChange={onAllSelectClick} value={selectionAllStatus.isSelected} />,
            renderData: (data, rowIndex) => {
                const key = rowKey === "index" ? rowIndex : data[rowKey];
                return <Checkbox disabled={isDisabled?.(data, rowIndex)} value={rowStatus[key].isChecked} onChange={() => onRowSelectClick(key)} />;
            },
        };

        return [rowSelectionColumn, ...columns];
    }, [columns, onAllSelectClick, onRowSelectClick, rowKey, rowSelection, rowStatus, selectionAllStatus]);

    React.useEffect(() => {
        if (onChangeRef.current && Object.values(rowStatus).length > 0) {
            const rowKeys: React.Key[] = [];
            const rows: RowType[] = [];
            Object.entries(rowStatus).forEach(([rowKey, status]) => {
                if (status.isChecked) {
                    rowKeys.push(rowKey);
                    rows.push(status.data);
                }
            });
            onChangeRef.current(rowKeys, rows);
        }
    }, [rowStatus, onChangeRef]);

    return transformedColumns;
};
