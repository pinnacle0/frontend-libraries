import React from "react";
import {NumberInput} from "./NumberInput";
import {Input} from "./Input";
import type {ControlledFormValue, PickOptional} from "../internal/type";
import {i18n} from "../internal/i18n/core";
import {Space} from "./Space";

export type AmountRangeValue<T extends boolean> = T extends true ? [number | null, number | null] : [number, number];

export interface Props<T extends boolean> extends ControlledFormValue<AmountRangeValue<T>> {
    allowNull: T;
    scale?: number;
    disabled?: boolean;
    min?: number;
    shouldNotEqual?: true;
    style?: React.CSSProperties;
    inputStyle?: React.CSSProperties;
}

export class AmountRangeInput<T extends boolean> extends React.PureComponent<Props<T>> {
    static displayName = "AmountRangeInput";

    static defaultProps: PickOptional<Props<any>> = {
        scale: 2,
        min: 0,
    };

    private readonly minInputStyle: React.CSSProperties = {borderTopRightRadius: 0, borderBottomRightRadius: 0, width: 80, textAlign: "right"};
    private readonly maxInputStyle: React.CSSProperties = {borderTopLeftRadius: 0, borderBottomLeftRadius: 0, width: 80, borderLeftWidth: 0, textAlign: "left"};
    private readonly connectorStyle: React.CSSProperties = {width: 30, borderLeftWidth: 0, borderRightWidth: 0, backgroundColor: "#fff", pointerEvents: "none"};

    onMinAmountChange = (value: number | null) => this.props.onChange([value, this.props.value[1]] as any);

    onMaxAmountChange = (value: number | null) => this.props.onChange([this.props.value[0], value] as any);

    render() {
        const {value, scale, disabled, min, shouldNotEqual, allowNull, style, inputStyle} = this.props;
        const t = i18n();
        return (
            <Space.Compact block style={style}>
                <NumberInput
                    disabled={disabled}
                    allowNull={allowNull!}
                    min={min}
                    scale={scale}
                    placeholder={t.minimum}
                    value={value[0] as any}
                    onChange={this.onMinAmountChange}
                    inputStyle={{...this.minInputStyle, ...inputStyle}}
                />
                <Input.Readonly style={this.connectorStyle} value="~" />
                <NumberInput
                    disabled={disabled}
                    allowNull={allowNull!}
                    min={value[0] !== null ? (shouldNotEqual ? value[0] + 1 : value[0]) : 0}
                    scale={scale}
                    placeholder={t.maximum}
                    value={value[1] as any}
                    onChange={this.onMaxAmountChange}
                    inputStyle={{...this.maxInputStyle, ...inputStyle}}
                />
            </Space.Compact>
        );
    }
}
