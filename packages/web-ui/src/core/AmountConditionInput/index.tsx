import React from "react";
import {Space} from "../Space";
import {NumberInput} from "../NumberInput";
import {EnumSelect} from "../EnumSelect";
import type {ControlledFormValue} from "../../internal/type";
import {ReactUtil} from "../../util/ReactUtil";

export enum Operator {
    GREATER_THAN = "GREATER_THAN",
    GREATER_EQUAL = "GREATER_EQUAL",
    LESS_THAN = "LESS_THAN",
    LESS_EQUAL = "LESS_EQUAL",
    EQUALS = "EQUALS",
    NOT_EQUALS = "NOT_EQUALS",
}

export interface AmountConditionValue {
    condition: Operator;
    amount: number | null;
}

export interface Props extends ControlledFormValue<AmountConditionValue> {
    scale: number;
    operators?: Operator[];
}

const selectStyle: React.CSSProperties = {width: 55};
const inputStyle: React.CSSProperties = {width: 180, borderTopLeftRadius: 0, borderBottomLeftRadius: 0};

export const AmountConditionInput = ReactUtil.memo("AmountConditionInput", (props: Props) => {
    const {value, onChange, scale, operators = [Operator.GREATER_THAN, Operator.GREATER_EQUAL, Operator.LESS_THAN, Operator.LESS_EQUAL, Operator.EQUALS]} = props;

    const onConditionChange = (condition: Operator) => onChange({condition, amount: value.amount});
    const onAmountChange = (amount: number | null) => onChange({condition: value.condition, amount});

    return (
        <Space.Compact block>
            <EnumSelect value={value.condition} onChange={onConditionChange} translator={operatorTranslator} list={operators} style={selectStyle} />
            <NumberInput allowNull scale={scale} value={value.amount} onChange={onAmountChange} inputStyle={inputStyle} />
        </Space.Compact>
    );
});

const operatorTranslator = (value: Operator): string => {
    switch (value) {
        case Operator.GREATER_THAN:
            return ">";
        case Operator.GREATER_EQUAL:
            return "≥";
        case Operator.LESS_THAN:
            return "<";
        case Operator.LESS_EQUAL:
            return "≤";
        case Operator.EQUALS:
            return "=";
        case Operator.NOT_EQUALS:
            return "≠";
    }
};
