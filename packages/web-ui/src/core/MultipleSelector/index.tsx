import React from "react";
import {TableColumns} from "../Table";
import {Popover} from "../Popover";
import {Button} from "../Button";
import {Tags} from "../Tags";
import {TooltipPlacement} from "../Tooltip";
import {i18n} from "../../internal/i18n/core";
import {ControlledFormValue, StringKey} from "../../internal/type";
import {StringUtil} from "../../internal/StringUtil";
import {TablePopover} from "./TablePopover";

export interface Props<RowType extends object> extends ControlledFormValue<RowType[]> {
    dataSource: RowType[];
    /**
     * Should not use "index" here, please provide a unique key based on record.
     */
    rowKeyExtractor: (record: RowType) => string;
    tableColumns: TableColumns<RowType>;
    /**
     * If string key, it will render each value as a closable tag with key as label.
     * If function returning string[] (must be same length with values), it will render as closable tags.
     * If function returning React Element, it will render the element itself.
     * If undefined, it will render nothing.
     */
    renderTags?: StringKey<RowType> | ((values: RowType[]) => React.ReactElement | string[]);
    renderPopover?: (table: React.ReactElement) => React.ReactElement;
    popoverPlacement?: TooltipPlacement;
    onPopoverFirstRender?: () => void;
    disabled?: "button" | "table";
    buttonText?: string;
    scrollY?: number;
}

export class MultipleSelector<RowType extends object> extends React.PureComponent<Props<RowType>> {
    static displayName = "MultipleSelector";

    onClose = (index: number) => {
        const {value, onChange} = this.props;
        const newValue = [...value];
        newValue.splice(index, 1);
        onChange(newValue);
    };

    renderSelectedAsTags = (labels: string[]) => {
        const {disabled} = this.props;
        return (
            <div className="g-multiple-selector-selected-tags">
                <Tags maxWidth={600} color="blue" items={labels} onClose={disabled ? undefined : this.onClose} />
            </div>
        );
    };

    renderSelectedItems = () => {
        const {value, renderTags} = this.props;
        if (renderTags) {
            if (typeof renderTags === "function") {
                const renderedResult = renderTags(value);
                return Array.isArray(renderedResult) ? this.renderSelectedAsTags(renderedResult) : renderedResult;
            } else {
                return this.renderSelectedAsTags(value.map(_ => _[renderTags] as any));
            }
        }
    };

    renderPopover = () => {
        const {renderPopover, value, onChange, disabled, onPopoverFirstRender, dataSource, tableColumns, rowKeyExtractor, scrollY} = this.props;
        return (
            <TablePopover
                dataSource={dataSource}
                columns={tableColumns}
                rowKeyExtractor={rowKeyExtractor}
                value={value}
                onChange={onChange}
                onFirstRender={onPopoverFirstRender}
                selectionDisabled={disabled === "table"}
                scrollY={scrollY || 500}
            >
                {renderPopover}
            </TablePopover>
        );
    };

    render() {
        const {value, popoverPlacement, buttonText, disabled} = this.props;
        const t = i18n();
        return (
            <div className="g-multiple-selector">
                {this.renderSelectedItems()}
                <Popover placement={popoverPlacement || "bottomLeft"} trigger="click" content={this.renderPopover}>
                    <Button color="wire-frame" disabled={disabled === "button"}>
                        {value.length === 0 ? buttonText || t.select : StringUtil.interpolate(t.edit, value.length.toString())}
                    </Button>
                </Popover>
            </div>
        );
    }
}
