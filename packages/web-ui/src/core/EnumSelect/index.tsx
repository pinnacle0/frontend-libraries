import {LabeledValue} from "antd/lib/select";
import React from "react";
import {ControlledFormValue} from "../../internal/type";
import {Select} from "../Select";
import {Nullable} from "./Nullable";
import {InitialNullable} from "./InitialNullable";
import {Map} from "./Map";
import "./index.less";

export interface BaseProps<Enum extends string | boolean | number> {
    list: readonly Enum[];
    translator: (enumValue: Enum) => React.ReactChild;
    disabled?: boolean;
    className?: string;
    style?: React.CSSProperties;
}

export interface Props<Enum extends string | boolean | number> extends BaseProps<Enum>, ControlledFormValue<Enum> {}

export class EnumSelect<Enum extends string | boolean | number> extends React.PureComponent<Props<Enum>> {
    static displayName = "EnumSelect";

    static Nullable = Nullable;
    static InitialNullable = InitialNullable;
    static Map = Map;

    getAntSelectValue = (): LabeledValue | undefined => {
        const value = this.props.value as Enum;
        const {translator} = this.props;
        const antValue = value.toString();
        const antLabel = translator(value);
        return {
            value: antValue,
            label: <span className="g-enum-select-label">{antLabel}</span>,
        };
    };

    onChange = ({value: antValue}: LabeledValue) => {
        const enumValue = antValue === "true" ? true : antValue === "false" ? false : antValue;
        this.props.onChange(enumValue as any);
    };

    render() {
        const {list, translator, disabled, className, style} = this.props;
        return (
            <Select<LabeledValue> disabled={disabled} labelInValue value={this.getAntSelectValue()} onChange={this.onChange} className={className} style={style}>
                {list.map(_ => (
                    <Select.Option key={_.toString()} value={_.toString()}>
                        {translator(_)}
                    </Select.Option>
                ))}
            </Select>
        );
    }
}
