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
import {ReactUtil} from "../../util/ReactUtil";

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

export const MultipleSelector = ReactUtil.memo("MultipleSelector", <RowType extends object>(props: Props<RowType>) => {
    const {
        value,
        onChange,
        renderButtonText,
        renderTags,
        popoverPlacement,
        disabled,
        popoverClassName,
        popoverStyle,
        popoverOpen,
        renderPopover,
        onPopoverOpenChange,
        onPopoverFirstRender,
        dataSource,
        tableColumns,
        rowKey,
        scrollY,
    } = props;
    const t = i18n();

    const buttonText = (): string => {
        if (renderButtonText) {
            return typeof renderButtonText === "string" ? renderButtonText : renderButtonText(value.length);
        } else {
            return value.length === 0 ? t.select : TextUtil.interpolate(t.edit, value.length.toString());
        }
    };

    const onClose = (index: number) => {
        const newValue = [...value];
        newValue.splice(index, 1);
        onChange(newValue);
    };

    const renderSelectedAsTags = (labels: string[]) => {
        return (
            <div className="g-multiple-selector-selected-tags">
                <Tags maxWidth={600} color="blue" items={labels} onClose={disabled ? undefined : onClose} useItemsAsKey />
            </div>
        );
    };

    const renderSelectedItems = () => {
        if (renderTags) {
            if (typeof renderTags === "function") {
                const renderedResult = renderTags(value);
                return Array.isArray(renderedResult) ? renderSelectedAsTags(renderedResult) : renderedResult;
            } else {
                return renderSelectedAsTags(value.map(_ => _[renderTags] as any));
            }
        }
    };

    return (
        <div className="g-multiple-selector">
            {renderSelectedItems()}
            <Popover
                placement={popoverPlacement || "bottomLeft"}
                trigger="click"
                content={
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
                }
                classNames={{root: popoverClassName}}
                styles={{root: popoverStyle}}
                open={popoverOpen}
                onOpenChange={onPopoverOpenChange}
            >
                <Button disabled={disabled === "button"}>{buttonText()}</Button>
            </Popover>
        </div>
    );
});
