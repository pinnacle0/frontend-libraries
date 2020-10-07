import {LabeledValue} from "antd/lib/select";
import React from "react";
import {i18n} from "../../internal/i18n/core";
import {ControlledFormValue, SafeReactChild} from "../../internal/type";
import {Select} from "../Select";
import "./index.less";

export interface Props<Enum extends string | boolean | number, Text extends React.ReactChild | false> extends ControlledFormValue<Text extends false ? Enum : Enum | null> {
    list: readonly Enum[];
    translator: (enumValue: Enum) => React.ReactChild;
    /**
     * If undefined, it will use value NULL to represent all case, with default "all" label.
     * If string, it will also use value NULL to represent all case, with the specified string as label.
     * If false, it will not include value NULL.
     */
    allowNull?: Text;
    disabled?: boolean;
    className?: string;
    style?: React.CSSProperties;
    prefix?: SafeReactChild;
    showSearch?: true;
    optionFilterProp?: string;
}

export class EnumSelect<Enum extends string | boolean | number, Text extends React.ReactChild | false> extends React.PureComponent<Props<Enum, Text>> {
    static displayName = "EnumSelect";

    private readonly nullValue = "@@null";

    getAntSelectValue = (): LabeledValue | undefined => {
        const value = this.props.value as Enum | null;
        const {allowNull, translator, prefix} = this.props;
        const t = i18n();
        const antValue = value === null ? this.nullValue : value.toString();
        const antLabel = value === null ? allowNull || t.all : translator(value);
        return {
            value: antValue,
            label: (
                <span className="g-enum-select-label">
                    {prefix && <span className="g-enum-select-prefix">{prefix}</span>}
                    {antLabel}
                </span>
            ),
        };
    };

    onChange = ({value: antValue}: LabeledValue) => {
        const enumValue = antValue === this.nullValue ? null : antValue === "true" ? true : antValue === "false" ? false : antValue;
        this.props.onChange!(enumValue as any);
    };

    render() {
        const {allowNull, list, translator, disabled, className, style, showSearch, optionFilterProp} = this.props;
        const t = i18n();
        return (
            <Select<LabeledValue>
                disabled={disabled}
                labelInValue
                value={this.getAntSelectValue()}
                onChange={this.onChange}
                className={className}
                style={style}
                options={list.map(_ => ({value: _.toString(), label: translator(_)}))}
                showSearch={showSearch}
                optionFilterProp={optionFilterProp}
            >
                {allowNull !== false && <Select.Option value={this.nullValue}>{allowNull || t.all}</Select.Option>}
            </Select>
        );
    }
}
