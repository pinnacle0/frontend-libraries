import React from "react";
import type {LabeledValue} from "antd/es/select";
import type {ControlledFormValue} from "../../internal/type";
import {Select} from "../Select";
import {Nullable} from "./Nullable";
import {InitialNullable} from "./InitialNullable";
import {Map} from "./Map";
import "./index.less";
import {ReactUtil} from "../../util/ReactUtil";

const TRUE_VALUE = "@@TRUE";
const FALSE_VALUE = "@@FALSE";

export interface BaseProps<Enum extends string | boolean | number> {
    list: readonly Enum[];
    translator?: (enumValue: Enum) => React.ReactElement | string | number | null;
    disabled?: boolean;
    className?: string;
    style?: React.CSSProperties;
    dropdownStyle?: React.CSSProperties;
    listHeight?: number;
    listItemHeight?: number;
    placeholder?: string;
    prefix?: React.ReactNode;
    suffixIcon?: React.ReactNode;
}

export interface Props<Enum extends string | boolean | number> extends BaseProps<Enum>, ControlledFormValue<Enum> {}

export const EnumSelect = ReactUtil.compound("EnumSelect", {Nullable, InitialNullable, Map}, <Enum extends string | boolean | number>(props: Props<Enum>) => {
    const {list, value, translator, prefix, onChange, disabled, className = "", style, dropdownStyle, listHeight, listItemHeight, placeholder, suffixIcon} = props;

    const getAntSelectValue = (): LabeledValue | undefined => {
        // Special case for InitialNullable, to show placeholder, no pre-selection
        if (value === null) return undefined;

        const antValue = value.toString();
        let antLabel = translator ? translator(value) : antValue;
        if (prefix) {
            antLabel = (
                <div className="prefixed-label-wrapper">
                    {prefix}
                    {antLabel}
                </div>
            );
        }
        return {
            value: antValue,
            label: antLabel,
        };
    };

    const onAntChange = ({value: antValue}: LabeledValue) => {
        const enumValue = antValue === TRUE_VALUE ? true : antValue === FALSE_VALUE ? false : antValue;
        onChange(enumValue as Enum);
    };

    return (
        <Select<LabeledValue>
            disabled={disabled}
            labelInValue
            value={getAntSelectValue()}
            onChange={onAntChange}
            className={`g-enum-select ${className}`}
            listHeight={listHeight}
            listItemHeight={listItemHeight}
            style={style}
            styles={{popup: {root: dropdownStyle}}}
            placeholder={
                prefix ? (
                    <div className="prefixed-placeholder-wrapper">
                        {prefix}
                        {placeholder}
                    </div>
                ) : (
                    placeholder
                )
            }
            suffixIcon={suffixIcon}
            optionLabelProp={prefix ? "label" : undefined}
        >
            {list.map(_ => {
                const label = translator ? translator(_) : _.toString();
                return (
                    <Select.Option title={null} key={_.toString()} value={_ === true ? TRUE_VALUE : _ === false ? FALSE_VALUE : _} label={label}>
                        {label}
                    </Select.Option>
                );
            })}
        </Select>
    );
});
