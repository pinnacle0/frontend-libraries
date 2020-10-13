import React from "react";
import {Table, TableColumns} from "../Table";
import {Popover} from "../Popover";
import {Button} from "../Button";
import {Tags} from "../Tags";
import {Checkbox} from "../Checkbox";
import {ControlledFormValue, PickOptional} from "../../internal/type";
import {TooltipPlacement} from "antd/lib/tooltip";
import {MessageUtil} from "../../util/MessageUtil";
import {i18n} from "../../internal/i18n/core";
import {StringUtil} from "../../internal/StringUtil";
import "./index.less";

export interface Props<RowType extends object> extends ControlledFormValue<RowType[]> {
    dataSource: RowType[];
    rowKeyExtractor: (record: RowType) => string;
    tableColumns: TableColumns<RowType>;
    /**
     * If return value is string[] (must be same length with values), it will render as closable tags.
     * If return value is JSX Element, it will render the element itself.
     * If undefined, it will render nothing.
     */
    renderSelectedItems?: (values: RowType[]) => React.ReactElement | string[];
    renderPopover?: (table: React.ReactElement) => React.ReactElement;
    popoverPlacement?: TooltipPlacement;
    showTableLoading?: boolean;
    onPopoverMounted?: () => void;
    disabled?: "button" | "table";
    /**
     * Attention:
     * If maxSelectedCount is specified (positive number), showSelectAll will not work.
     */
    maxSelectedCount?: number;
    showSelectAll?: boolean;
    buttonText?: string;
    scrollY?: number;
}

export class MultipleSelector<RowType extends object> extends React.PureComponent<Props<RowType>> {
    static displayName = "MultipleSelector";
    static defaultProps: PickOptional<Props<any>> = {
        renderPopover: table => table,
        popoverPlacement: "bottomLeft",
    };

    private readonly selectAllStyle: React.CSSProperties = {marginBottom: 8};
    private isPopoverMounted = false;

    getTableRowClassName = (item: RowType) => (this.getSelectedIndexInValue(item) >= 0 ? "selected" : "");

    getSelectedIndexInValue = (item: RowType) => {
        const {value, rowKeyExtractor} = this.props;
        return value.findIndex(_ => rowKeyExtractor(_) === rowKeyExtractor(item));
    };

    onVisibleChange = (visible: boolean) => {
        if (visible && !this.isPopoverMounted && this.props.onPopoverMounted) {
            this.props.onPopoverMounted();
        }
        this.isPopoverMounted = true;
    };

    onToggleElement = (item: RowType | number) => {
        const {value, onChange, disabled, maxSelectedCount} = this.props;
        const t = i18n();
        if (typeof item === "number") {
            this.onToggleElement(value[item]);
        } else if (!disabled) {
            const selectedIndex = this.getSelectedIndexInValue(item);
            if (selectedIndex >= 0) {
                const newList = [...value];
                newList.splice(selectedIndex, 1);
                onChange(newList);
            } else {
                if (maxSelectedCount && value.length >= maxSelectedCount) {
                    MessageUtil.error(StringUtil.interpolate(t.selectReachMax, maxSelectedCount.toString()));
                } else {
                    onChange([...value, item]);
                }
            }
        }
    };

    onSelectAll = (value: boolean) => this.props.onChange(value ? this.props.dataSource : []);

    renderTable = () => {
        const {dataSource, tableColumns, rowKeyExtractor, showTableLoading, value, scrollY, maxSelectedCount, showSelectAll, disabled} = this.props;
        const t = i18n();
        const canSelectAll = showSelectAll && !maxSelectedCount && disabled === undefined;
        return (
            <div className="g-multiple-selector-table">
                {canSelectAll && (
                    <Checkbox
                        onChange={this.onSelectAll}
                        value={dataSource.length === value.length}
                        indeterminate={this.props.value.length > 0 && this.props.value.length != this.props.dataSource.length}
                        style={this.selectAllStyle}
                    >
                        {t.selectAll}
                    </Checkbox>
                )}
                <Table
                    scrollY={scrollY || 400}
                    onRowClick={disabled === "table" ? undefined : this.onToggleElement}
                    rowClassName={this.getTableRowClassName}
                    shouldRenderIfUpdate={value}
                    size="small"
                    loading={showTableLoading}
                    dataSource={dataSource}
                    columns={tableColumns}
                    rowKey={rowKeyExtractor}
                    scrollX="none"
                    className={disabled === "table" ? "disabled" : ""}
                />
            </div>
        );
    };

    renderSelectedItems = () => {
        const {value, renderSelectedItems, disabled} = this.props;
        if (renderSelectedItems) {
            const renderedResult = renderSelectedItems(value);
            if (Array.isArray(renderedResult)) {
                return <Tags maxWidth={600} status="success" items={renderedResult} onClose={disabled ? undefined : this.onToggleElement} />;
            } else {
                return renderedResult;
            }
        }
    };

    render() {
        const {renderPopover, value, popoverPlacement, buttonText, disabled} = this.props;
        const t = i18n();
        return (
            <React.Fragment>
                {this.renderSelectedItems()}
                <Popover placement={popoverPlacement} trigger="click" content={renderPopover!(this.renderTable())} onVisibleChange={this.onVisibleChange}>
                    <Button color="wire-frame" disabled={disabled === "button"}>
                        {value.length === 0 ? buttonText || t.select : StringUtil.interpolate(t.edit, value.length.toString())}
                    </Button>
                </Popover>
            </React.Fragment>
        );
    }
}
