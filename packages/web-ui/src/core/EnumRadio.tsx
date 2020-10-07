import React from "react";
import {Radio, RadioChangeEvent} from "./Radio";
import {i18n} from "../internal/i18n/core";
import {ControlledFormValue} from "../internal/type";

export interface Props<Enum extends string | boolean | number, Text extends React.ReactChild | false> extends ControlledFormValue<Text extends false ? Enum : Enum | null> {
    list: readonly Enum[];
    translator: (enumValue: Enum) => React.ReactChild;
    /**
     * If undefined, it will use value NULL to represent all case, with default "all" label.
     * If string, it will also use value NULL to represent all case, with the specified string as label.
     * If false, it will not include value NULL.
     */
    allowNull?: Text;
    useButtonMode?: boolean;
    className?: string;
    style?: React.CSSProperties;
}

export class EnumRadio<Enum extends string | boolean | number, Text extends React.ReactChild | false> extends React.PureComponent<Props<Enum, Text>> {
    static displayName = "EnumRadio";

    private readonly nullValue = "@@null";

    onChange = (event: RadioChangeEvent) => {
        // event.target.value is what you passed (including string & boolean)
        // antValue is string (including boolean/null case)
        const antValue = event.target.value;
        const enumValue = antValue === this.nullValue ? null : antValue === "true" ? true : antValue === "false" ? false : antValue;
        this.props.onChange!(enumValue);
    };

    render() {
        const {allowNull, list, translator, value, useButtonMode, className, style} = this.props;
        const t = i18n();
        const antValue = value === null ? this.nullValue : value === undefined ? undefined : value.toString();
        const RadioItem = useButtonMode ? Radio.Button : Radio;
        return (
            <Radio.Group value={antValue} onChange={this.onChange} className={className} style={style} optionType={useButtonMode ? "button" : undefined}>
                {allowNull !== false && <RadioItem value={this.nullValue}>{allowNull || t.all}</RadioItem>}
                {list.map(_ => (
                    <RadioItem key={_.toString()} value={_.toString()}>
                        {translator(_)}
                    </RadioItem>
                ))}
            </Radio.Group>
        );
    }
}
