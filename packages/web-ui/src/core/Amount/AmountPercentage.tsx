import React from "react";
import type {Props as AmountProps} from "./index";
import {Amount} from "./index";

type OmitPropsKeys = "postfix" | "scale" | "value";

interface BaseProps extends Omit<AmountProps, OmitPropsKeys> {}

interface OwnProps {
    /**
     * Number of decimal points used for **percentage** values.
     *
     * To use 2 decimal points (eg 12.34%) in percentage values, `props.percentageScale` should be `2`.
     * Must be an integer, otherwise throws an Error.
     */
    percentageScale: number;

    /**
     * Value of display amount in **decimal** number.
     *
     * If the value is `20%`, then `props.value` should be `0.2`.
     */
    value: number | null;
}

export interface Props extends BaseProps, OwnProps {}

export class AmountPercentage extends React.PureComponent<Props> {
    static displayName = "AmountPercentage";

    render() {
        const {percentageScale, value, ...restProps} = this.props;
        const percentageValue = value !== null ? value * 100 : value;
        return <Amount value={percentageValue} scale={percentageScale} postfix="%" {...restProps} />;
    }
}
