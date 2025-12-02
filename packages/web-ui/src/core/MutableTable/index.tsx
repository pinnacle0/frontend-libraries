import React from "react";
import type {TableColumns} from "../Table";
import {Table} from "../Table";
import {i18n} from "../../internal/i18n/core";
import {ReactUtil} from "../../util/ReactUtil";
import "./index.less";

/**
 * A MutableTable is a table supporting add/minus rows.
 * The table should contain at least 1 row.
 * If props.nextRow is undefined, the (+) button should be disabled.
 *
 * Attention:
 * dataSource must not be empty array.
 */

export interface SequenceColumnConfig {
    title: string;
    renderer: (index: number) => string;
    width: number;
    align: "left" | "center" | "right";
}

export interface Props<RowType extends object> {
    dataSource: RowType[];
    columns: TableColumns<RowType>;
    onChange?: (values: RowType[]) => void;
    onRowCountChange?: (type: "add-row" | "remove-row") => void;
    nextRow?: RowType | true; // If true, onRowCountChange will be triggered when + is clicked, instead of onChange
    fixedRowCount?: number;
    shouldRenderIfUpdate?: any;
    sequenceColumn?: Partial<SequenceColumnConfig> | "default";
    scrollX?: "max-content" | "none" | number;
    scrollY?: number;
    bordered?: boolean;
    disabled?: boolean;
}

const defaultSequenceColumn: SequenceColumnConfig = {
    title: i18n().sequence,
    renderer: (index: number) => (index + 1).toString(),
    width: 90,
    align: "center",
};

export const MutableTable = ReactUtil.memo("MutableTable", <RowType extends object>(props: Props<RowType>) => {
    const {dataSource, shouldRenderIfUpdate, scrollX = "none", scrollY, bordered, columns, sequenceColumn, fixedRowCount, disabled, nextRow, onChange, onRowCountChange} = props;
    const previousDataSourceLength = React.useRef(dataSource.length);
    const ref = React.useRef<HTMLDivElement>(null);

    React.useEffect(() => {
        if (previousDataSourceLength.current < dataSource.length && Number(scrollY) > 0) {
            const tableContainerRef = ref.current!.querySelector(".ant-table-body");
            if (tableContainerRef) {
                tableContainerRef.scrollTop = tableContainerRef.scrollHeight;
            }
        }
    }, [dataSource.length, scrollY]);

    const getColumns = (): TableColumns<RowType> => {
        const newColumns = [...columns];
        const t = i18n();
        if (sequenceColumn) {
            const finalSequenceColumn = sequenceColumn === "default" ? defaultSequenceColumn : {...defaultSequenceColumn, ...sequenceColumn};
            newColumns.unshift({
                title: finalSequenceColumn.title,
                width: finalSequenceColumn.width,
                align: finalSequenceColumn.align,
                fixed: scrollX === "none" ? undefined : "left",
                renderData: (_, index) => finalSequenceColumn.renderer(index),
            });
        }
        newColumns.push({
            title: t.action,
            width: 100,
            align: "center",
            fixed: scrollX === "none" ? undefined : "right",
            renderData: (_, index) => {
                const dataSourceLength = dataSource.length;
                return (
                    <div className="operation">
                        {(!fixedRowCount || fixedRowCount <= index) && (
                            <button type="button" disabled={disabled || dataSourceLength === 1} onClick={() => onDeleteRow(index)}>
                                &#65293;
                            </button>
                        )}
                        {index === dataSourceLength - 1 && (
                            <button disabled={disabled || nextRow === undefined} type="button" onClick={() => onAddRow(nextRow!)}>
                                &#xff0b;
                            </button>
                        )}
                    </div>
                );
            },
        });
        return newColumns;
    };

    const onDeleteRow = (index: number) => {
        if (onRowCountChange) {
            onRowCountChange("remove-row");
        }

        if (onChange) {
            const newData = [...dataSource];
            newData.splice(index, 1);
            onChange(newData);
        }
    };

    const onAddRow = (nextRow: RowType | true) => {
        if (onRowCountChange) {
            onRowCountChange("add-row");
        }

        if (nextRow !== true && onChange) {
            const newData = [...dataSource];
            newData.push(nextRow);
            onChange(newData);
        }
    };

    return (
        <div className="g-mutable-table-wrapper" ref={ref}>
            <Table
                className="g-mutable-table"
                scrollX={scrollX}
                scrollY={scrollY}
                rowKey="index"
                columns={getColumns()}
                dataSource={dataSource}
                shouldRenderIfUpdate={shouldRenderIfUpdate}
                bordered={bordered}
            />
        </div>
    );
});
