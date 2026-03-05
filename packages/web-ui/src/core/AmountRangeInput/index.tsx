import React from "react";
import {NumberInput} from "../NumberInput";
import {Input} from "../Input";
import type {ControlledFormValue} from "../../internal/type";
import {i18n} from "../../internal/i18n/core";
import {Space} from "../Space";
import {ReactUtil} from "../../util/ReactUtil";
import "./index.less";

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

export const AmountRangeInput = ReactUtil.memo("AmountRangeInput", <T extends boolean>(props: Props<T>) => {
    const {value, onChange, scale = 2, disabled, min = 0, shouldNotEqual, allowNull, style, inputStyle} = props;
    const t = i18n();

    const onMinAmountChange = (minValue: number | null) => onChange([minValue, value[1]] as any);
    const onMaxAmountChange = (maxValue: number | null) => onChange([value[0], maxValue] as any);

    return (
        <Space.Compact block className="g-amount-range-input" style={style}>
            <NumberInput disabled={disabled} allowNull={allowNull!} min={min} scale={scale} placeholder={t.minimum} value={value[0] as any} onChange={onMinAmountChange} inputStyle={inputStyle} />
            <Input.Readonly className="g-amount-range-connector" value="~" />
            <NumberInput
                disabled={disabled}
                allowNull={allowNull!}
                min={value[0] !== null ? (shouldNotEqual ? value[0] + 1 : value[0]) : 0}
                scale={scale}
                placeholder={t.maximum}
                value={value[1] as any}
                onChange={onMaxAmountChange}
                inputStyle={inputStyle}
            />
        </Space.Compact>
    );
});
