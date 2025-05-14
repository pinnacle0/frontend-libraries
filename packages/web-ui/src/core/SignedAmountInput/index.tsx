import React from "react";
import {Space} from "../Space";
import {NumberInput} from "../NumberInput";
import {Select} from "../Select";
import type {ControlledFormValue} from "../../internal/type";
import {i18n} from "../../internal/i18n/core";

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

export class SignedAmountInput extends React.PureComponent<Props> {
    static displayName = "SignedAmountInput";

    private readonly selectStyle: React.CSSProperties = {width: 96};
    private readonly inputStyle: React.CSSProperties = {borderTopLeftRadius: 0, borderBottomLeftRadius: 0};

    onInputChange = (amount: number | null) => {
        const {value, onChange} = this.props;
        onChange({isIncrease: value.isIncrease, amount});
    };

    onSelectChange = (newValue: "+" | "-") => {
        const isIncrease = newValue === "+";
        const {value, onChange, onSignChange} = this.props;
        onChange({isIncrease, amount: value.amount});
        if (onSignChange) {
            onSignChange(isIncrease);
        }
    };

    render() {
        const {value, labels, scale, max} = this.props;
        const t = i18n();
        const safeScale = scale || 2;
        const min = Number(Math.pow(0.1, safeScale).toFixed(safeScale));
        return (
            <Space.Compact>
                <Select onChange={this.onSelectChange} value={value.isIncrease ? "+" : "-"} style={this.selectStyle}>
                    <Select.Option key="+" value="+">
                        {labels[0] || t.depositPositive + " (+)"}
                    </Select.Option>
                    <Select.Option key="-" value="-">
                        {labels[1] || t.depositNegative + " (-)"}
                    </Select.Option>
                </Select>
                <NumberInput allowNull value={value.amount} min={min} max={max} scale={scale} onChange={this.onInputChange} inputStyle={this.inputStyle} />
            </Space.Compact>
        );
    }
}
