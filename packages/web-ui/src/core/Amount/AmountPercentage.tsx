import React from "react";
import type {Props as AmountProps} from "./index";
import {Amount} from "./index";
import {ReactUtil} from "../../util/ReactUtil";

export interface Props extends Omit<AmountProps, "postfix" | "scale" | "value"> {
    /**
     * Value of display amount in decimal, e.g: 0.2 for 20%.
     */
    value: number | null | undefined;
    /**
     * Number of decimal points used for percentage values.
     *
     * To use 2 decimal points (eg 12.34%) in percentage values, `props.percentageScale` should be `2`.
     * Must be an integer, otherwise throws an Error.
     */
    percentageScale: number;
}

export const AmountPercentage = ReactUtil.memo("AmountPercentage", ({percentageScale, value, ...restProps}: Props) => {
    const percentageValue = value !== null && value !== undefined ? value * 100 : value;
    return <Amount value={percentageValue} scale={percentageScale} postfix="%" {...restProps} />;
});
