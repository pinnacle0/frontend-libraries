import React from "react";
import type {RadioChangeEvent} from "../Radio";
import {Radio} from "../Radio";
import type {ControlledFormValue} from "../../internal/type";
import {Nullable} from "./Nullable";
import {InitialNullable} from "./InitialNullable";
import {Map} from "./Map";

export interface BaseProps<Enum extends string | boolean | number> {
    list: readonly Enum[];
    translator?: (enumValue: Enum) => React.ReactChild;
    useButtonMode?: boolean;
    disabled?: boolean;
    className?: string;
    style?: React.CSSProperties;
}

export interface Props<Enum extends string | boolean | number> extends BaseProps<Enum>, ControlledFormValue<Enum> {}

export class EnumRadio<Enum extends string | boolean | number> extends React.PureComponent<Props<Enum>> {
    static displayName = "EnumRadio";
    static Nullable = Nullable;
    static InitialNullable = InitialNullable;
    static Map = Map;

    onChange = (event: RadioChangeEvent) => {
        const enumValue: Enum = event.target.value;
        this.props.onChange(enumValue);
    };

    render() {
        const {list, translator, value, useButtonMode, disabled, className, style} = this.props;
        const RadioItem = useButtonMode ? Radio.Button : Radio;
        return (
            <Radio.Group value={value} onChange={this.onChange} disabled={disabled} className={className} style={style} optionType={useButtonMode ? "button" : undefined}>
                {list.map(_ => (
                    // RadioItem can accept any type as value, and emit the exact type while onChange
                    <RadioItem key={_.toString()} value={_}>
                        {translator ? translator(_) : _.toString()}
                    </RadioItem>
                ))}
            </Radio.Group>
        );
    }
}
