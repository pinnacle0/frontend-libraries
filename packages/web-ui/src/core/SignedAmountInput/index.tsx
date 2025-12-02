import React from "react";
import {Space} from "../Space";
import {NumberInput} from "../NumberInput";
import {Select} from "../Select";
import type {ControlledFormValue} from "../../internal/type";
import {i18n} from "../../internal/i18n/core";
import {ReactUtil} from "../../util/ReactUtil";

export interface SignedAmountInputData {
    isIncrease: boolean;
    amount: number | null; // Always store positive number (or null for empty input), keep same as UI
}

export interface Props extends ControlledFormValue<SignedAmountInputData> {
    labels: [string, string];
    onSignChange?: (isIncrease: boolean) => void;
    scale?: number; // Default: 2
    max?: number;
}

const selectStyle: React.CSSProperties = {width: 96};
const inputStyle: React.CSSProperties = {borderTopLeftRadius: 0, borderBottomLeftRadius: 0};

export const SignedAmountInput = ReactUtil.memo("SignedAmountInput", (props: Props) => {
    const {value, labels, scale = 2, max, onChange, onSignChange} = props;
    const t = i18n();

    const onInputChange = (amount: number | null) => onChange({isIncrease: value.isIncrease, amount});

    const onSelectChange = (newValue: "+" | "-") => {
        const isIncrease = newValue === "+";
        onChange({isIncrease, amount: value.amount});

        if (onSignChange) onSignChange(isIncrease);
    };

    const min = Number(Math.pow(0.1, scale).toFixed(scale));
    return (
        <Space.Compact>
            <Select onChange={onSelectChange} value={value.isIncrease ? "+" : "-"} style={selectStyle}>
                <Select.Option key="+" value="+">
                    {labels[0] || t.depositPositive + " (+)"}
                </Select.Option>
                <Select.Option key="-" value="-">
                    {labels[1] || t.depositNegative + " (-)"}
                </Select.Option>
            </Select>
            <NumberInput allowNull value={value.amount} min={min} max={max} scale={scale} onChange={onInputChange} inputStyle={inputStyle} />
        </Space.Compact>
    );
});
