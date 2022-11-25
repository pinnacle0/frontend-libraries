import React from "react";
import type {LabeledValue} from "antd/es/select";
import type {ControlledFormValue} from "../../internal/type";
import {Select} from "../Select";
import {Nullable} from "./Nullable";
import {InitialNullable} from "./InitialNullable";
import {Map} from "./Map";
import "./index.less";

export interface BaseProps<Enum extends string | boolean | number> {
    list: readonly Enum[];
    translator?: (enumValue: Enum) => React.ReactElement | string | number | null;
    disabled?: boolean;
    className?: string;
    style?: React.CSSProperties;
    placeholder?: string;
    suffixIcon?: React.ReactNode;
}

export interface Props<Enum extends string | boolean | number> extends BaseProps<Enum>, ControlledFormValue<Enum> {}

export class EnumSelect<Enum extends string | boolean | number> extends React.PureComponent<Props<Enum>> {
    private readonly trueValue = "@@TRUE";
    private readonly falseValue = "@@FALSE";

    static displayName = "EnumSelect";

    static Nullable = Nullable;
    static InitialNullable = InitialNullable;
    static Map = Map;

    getAntSelectValue = (): LabeledValue | undefined => {
        const value = this.props.value as Enum;
        if (value === null) {
            // Special case for InitialNullable, to show placeholder, no pre-selection
            return undefined;
        }

        const {translator} = this.props;
        const antValue = value.toString();
        const antLabel = translator ? translator(value) : antValue;
        return {
            value: antValue,
            label: antLabel,
        };
    };

    onChange = ({value: antValue}: LabeledValue) => {
        const enumValue = antValue === this.trueValue ? true : antValue === this.falseValue ? false : antValue;
        this.props.onChange(enumValue as Enum);
    };

    render() {
        const {list, translator, disabled, className = "", style, placeholder, suffixIcon} = this.props;
        return (
            <Select<LabeledValue>
                disabled={disabled}
                labelInValue
                value={this.getAntSelectValue()}
                onChange={this.onChange}
                className={`g-enum-select ${className}`}
                style={style}
                placeholder={placeholder}
                suffixIcon={suffixIcon}
            >
                {list.map(_ => (
                    <Select.Option key={_.toString()} value={_ === true ? this.trueValue : _ === false ? this.falseValue : _}>
                        {translator ? translator(_) : _.toString()}
                    </Select.Option>
                ))}
            </Select>
        );
    }
}
