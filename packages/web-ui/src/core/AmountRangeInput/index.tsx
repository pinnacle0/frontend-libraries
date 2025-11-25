import React from "react";
import {NumberInput} from "../NumberInput";
import {Input} from "../Input";
import type {ControlledFormValue} from "../../internal/type";
import {i18n} from "../../internal/i18n/core";
import {Space} from "../Space";
import {ReactUtil} from "../../util/ReactUtil";

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

const minInputStyle: React.CSSProperties = {borderTopRightRadius: 0, borderBottomRightRadius: 0, width: 80, textAlign: "right"};
const maxInputStyle: React.CSSProperties = {borderTopLeftRadius: 0, borderBottomLeftRadius: 0, width: 80, borderLeftWidth: 0, textAlign: "left"};
const connectorStyle: React.CSSProperties = {width: 30, borderLeftWidth: 0, borderRightWidth: 0, backgroundColor: "#fff", pointerEvents: "none"};

export const AmountRangeInput = ReactUtil.memo("AmountRangeInput", <T extends boolean>(props: Props<T>) => {
    const {value, onChange, scale = 2, disabled, min = 0, shouldNotEqual, allowNull, style, inputStyle} = props;
    const t = i18n();

    const onMinAmountChange = (minValue: number | null) => onChange([minValue, value[1]] as any);
    const onMaxAmountChange = (maxValue: number | null) => onChange([value[0], maxValue] as any);

    return (
        <Space.Compact block style={style}>
            <NumberInput
                disabled={disabled}
                allowNull={allowNull!}
                min={min}
                scale={scale}
                placeholder={t.minimum}
                value={value[0] as any}
                onChange={onMinAmountChange}
                inputStyle={{...minInputStyle, ...inputStyle}}
            />
            <Input.Readonly style={connectorStyle} value="~" />
            <NumberInput
                disabled={disabled}
                allowNull={allowNull!}
                min={value[0] !== null ? (shouldNotEqual ? value[0] + 1 : value[0]) : 0}
                scale={scale}
                placeholder={t.maximum}
                value={value[1] as any}
                onChange={onMaxAmountChange}
                inputStyle={{...maxInputStyle, ...inputStyle}}
            />
        </Space.Compact>
    );
});
