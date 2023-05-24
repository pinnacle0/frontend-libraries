import React from "react";
import type {TableColumns} from "../Table";
import {Table} from "../Table";
import type {PickOptional} from "../../internal/type";
import {i18n} from "../../internal/i18n/core";
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

export class MutableTable<RowType extends object> extends React.PureComponent<Props<RowType>> {
    static displayName = "MutableTable";

    static defaultProps: PickOptional<Props<any>> = {
        scrollX: "none",
    };

    private readonly ref: React.RefObject<HTMLDivElement>;
    private readonly defaultSequenceColumn: SequenceColumnConfig = {
        title: i18n().sequence,
        renderer: (index: number) => (index + 1).toString(),
        width: 90,
        align: "center",
    };

    constructor(props: Props<RowType>) {
        super(props);
        this.ref = React.createRef();
    }

    componentDidUpdate(prevProps: Props<RowType>) {
        if (prevProps.dataSource.length < this.props.dataSource.length && Number(this.props.scrollY) > 0) {
            const tableContainerRef = this.ref.current!.querySelector(".ant-table-body");
            if (tableContainerRef) {
                tableContainerRef.scrollTop = tableContainerRef.scrollHeight;
            }
        }
    }

    getColumns = (): TableColumns<RowType> => {
        const {columns, dataSource, nextRow, fixedRowCount, scrollX, sequenceColumn, disabled} = this.props;
        const newColumns = [...columns];
        const t = i18n();
        if (sequenceColumn) {
            const finalSequenceColumn = sequenceColumn === "default" ? this.defaultSequenceColumn : {...this.defaultSequenceColumn, ...sequenceColumn};
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
                            <button type="button" disabled={disabled || dataSourceLength === 1} onClick={() => this.onDeleteRow(index)}>
                                &#65293;
                            </button>
                        )}
                        {index === dataSourceLength - 1 && (
                            <button disabled={disabled || nextRow === undefined} type="button" onClick={() => this.onAddRow(nextRow!)}>
                                &#xff0b;
                            </button>
                        )}
                    </div>
                );
            },
        });
        return newColumns;
    };

    onDeleteRow = (index: number) => {
        const {dataSource, onChange, onRowCountChange} = this.props;
        if (onRowCountChange) {
            onRowCountChange("remove-row");
        }

        if (onChange) {
            const newData = [...dataSource];
            newData.splice(index, 1);
            onChange(newData);
        }
    };

    onAddRow = (nextRow: RowType | true) => {
        const {dataSource, onChange, onRowCountChange} = this.props;
        if (onRowCountChange) {
            onRowCountChange("add-row");
        }

        if (nextRow !== true && onChange) {
            const newData = [...dataSource];
            newData.push(nextRow);
            onChange(newData);
        }
    };

    render() {
        const {dataSource, shouldRenderIfUpdate, scrollX, scrollY, bordered} = this.props;
        return (
            <div className="g-mutable-table-wrapper" ref={this.ref}>
                <Table
                    className="g-mutable-table"
                    scrollX={scrollX}
                    scrollY={scrollY}
                    rowKey="index"
                    columns={this.getColumns()}
                    dataSource={dataSource}
                    shouldRenderIfUpdate={shouldRenderIfUpdate}
                    bordered={bordered}
                />
            </div>
        );
    }
}
