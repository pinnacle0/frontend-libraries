import React from "react";
import type {TableColumns} from "../Table";
import {Popover} from "../Popover";
import {Button} from "../Button";
import {Tags} from "../Tags";
import type {TooltipPlacement} from "../Tooltip";
import {i18n} from "../../internal/i18n/core";
import type {ControlledFormValue, StringKey} from "../../internal/type";
import {TextUtil} from "../../internal/TextUtil";
import {TablePopover} from "./TablePopover";

export interface Props<RowType extends object> extends ControlledFormValue<RowType[]> {
    dataSource: RowType[];
    rowKey: StringKey<RowType> | ((record: RowType, index?: number) => string);
    tableColumns: TableColumns<RowType>;
    /**
     * If string key, it will render each value as a closable tag with key as label.
     * If function returning string[] (must be same length with values), it will render as closable tags.
     * If function returning React Element, it will render the element itself.
     * If undefined, it will render nothing.
     */
    renderTags?: StringKey<RowType> | ((values: RowType[]) => React.ReactElement | string[]);
    renderPopover?: (table: React.ReactElement) => React.ReactElement;
    renderButtonText?: string | ((selectedCount: number) => string);
    popoverPlacement?: TooltipPlacement;
    popoverClassName?: string;
    popoverStyle?: React.CSSProperties;
    onPopoverFirstRender?: () => void;
    disabled?: "button" | "table";
    scrollY?: number;
    popoverOpen?: boolean;
    onPopoverOpenChange?: (open: boolean) => void;
}

export class MultipleSelector<RowType extends object> extends React.PureComponent<Props<RowType>> {
    static displayName = "MultipleSelector";

    buttonText = (): string => {
        const {value, renderButtonText} = this.props;
        const t = i18n();
        const length = value.length;
        if (renderButtonText) {
            return typeof renderButtonText === "string" ? renderButtonText : renderButtonText(length);
        } else {
            return value.length === 0 ? t.select : TextUtil.interpolate(t.edit, value.length.toString());
        }
    };

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
        const {renderPopover, value, onChange, disabled, onPopoverFirstRender, dataSource, tableColumns, rowKey, scrollY} = this.props;
        return (
            <TablePopover
                dataSource={dataSource}
                columns={tableColumns}
                rowKey={rowKey}
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
        const {popoverPlacement, disabled, popoverClassName, popoverStyle} = this.props;
        return (
            <div className="g-multiple-selector">
                {this.renderSelectedItems()}
                <Popover
                    placement={popoverPlacement || "bottomLeft"}
                    trigger="click"
                    content={this.renderPopover()}
                    overlayClassName={popoverClassName}
                    overlayStyle={popoverStyle}
                    open={this.props.popoverOpen}
                    onOpenChange={this.props.onPopoverOpenChange}
                >
                    <Button disabled={disabled === "button"}>{this.buttonText()}</Button>
                </Popover>
            </div>
        );
    }
}
