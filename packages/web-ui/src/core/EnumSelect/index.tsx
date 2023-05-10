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
    prefix?: React.ReactNode;
    suffixIcon?: React.ReactNode;
}

export interface Props<Enum extends string | boolean | number> extends BaseProps<Enum>, ControlledFormValue<Enum> {}

export class EnumSelect<Enum extends string | boolean | number> extends React.PureComponent<Props<Enum>> {
    private readonly trueValue = "@@TRUE";
    private readonly falseValue = "@@FALSE";
    private readonly allPrefixedLabeledValues: LabeledValue[] = [];

    static displayName = "EnumSelect";

    static Nullable = Nullable;
    static InitialNullable = InitialNullable;
    static Map = Map;

    override componentDidMount(): void {
        const {list, prefix} = this.props;

        if (prefix) {
            list.forEach(_ => {
                const value = _;
                const antValue = value.toString();
                const antLabel = this.getAntLabel(value);
                this.allPrefixedLabeledValues.push({
                    value: antValue,
                    label: antLabel,
                });
            });
        }
    }

    getAntSelectValue = (): LabeledValue | undefined => {
        const value = this.props.value as Enum;
        if (value === null) {
            // Special case for InitialNullable, to show placeholder, no pre-selection
            return undefined;
        }

        const antValue = value.toString();
        const antLabel = this.getAntLabel(value);
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
        const {list, translator, disabled, className = "", style, placeholder, suffixIcon, prefix} = this.props;
        const value: LabeledValue | null | undefined = prefix ? this.allPrefixedLabeledValues.find(x => x.value === this.props.value) || this.getAntSelectValue() : this.getAntSelectValue();

        return (
            <Select<LabeledValue>
                disabled={disabled}
                labelInValue
                value={value}
                onChange={this.onChange}
                className={`g-enum-select ${className}`}
                style={style}
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
                {list.map(_ => (
                    <Select.Option
                        key={_.toString()}
                        value={_ === true ? this.trueValue : _ === false ? this.falseValue : _}
                        label={prefix ? this.allPrefixedLabeledValues.find(x => x.value === _)?.label : undefined}
                    >
                        {translator ? translator(_) : _.toString()}
                    </Select.Option>
                ))}
            </Select>
        );
    }

    private getAntLabel(value: Enum): string | number | React.ReactElement<any, string | React.JSXElementConstructor<any>> | null {
        const {translator, prefix} = this.props;
        const antValue = value.toString();
        let antLabel = translator ? translator(value) : antValue;
        if (prefix) {
            antLabel = (
                <div className="prefixed-label-wrapper">
                    {this.props.prefix}
                    {antLabel}
                </div>
            );
        }
        return antLabel;
    }
}
