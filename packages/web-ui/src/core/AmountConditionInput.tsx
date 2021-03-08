import React from "react";
import {NumberInput} from "./NumberInput";
import {Input} from "./Input";
import {EnumSelect} from "./EnumSelect";
import type {ControlledFormValue} from "../internal/type";

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

export class AmountConditionInput extends React.PureComponent<Props> {
    static displayName = "AmountConditionInput";

    private readonly operators: Operator[] = this.props.operators || [Operator.GREATER_THAN, Operator.GREATER_EQUAL, Operator.LESS_THAN, Operator.LESS_EQUAL, Operator.EQUALS];
    private readonly selectStyle: React.CSSProperties = {width: 55};
    private readonly inputStyle: React.CSSProperties = {width: 180, borderTopLeftRadius: 0, borderBottomLeftRadius: 0};

    operatorTranslator = (value: Operator): string => {
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

    onConditionChange = (value: Operator) => this.props.onChange({condition: value, amount: this.props.value.amount});

    onAmountChange = (value: number | null) => this.props.onChange({condition: this.props.value.condition, amount: value});

    render() {
        const {scale, value} = this.props;
        return (
            <Input.Group compact>
                <EnumSelect value={value.condition} onChange={this.onConditionChange} translator={this.operatorTranslator} list={this.operators} style={this.selectStyle} />
                <NumberInput allowNull scale={scale} value={value.amount} onChange={this.onAmountChange} inputStyle={this.inputStyle} />
            </Input.Group>
        );
    }
}
