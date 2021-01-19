import React from "react";
import type {Props as AmountProps} from "./index";
import {Amount} from "./index";

type OmitPropsKeys = "postfix" | "scale" | "value";

interface BaseProps extends Omit<AmountProps, OmitPropsKeys> {}

interface OwnProps {
    /**
     * Value of display amount in decimal, e.g: 0.2 for 20%.
     */
    value?: number | null;
    /**
     * Number of decimal points used for **percentage** values.
     *
     * To use 2 decimal points (eg 12.34%) in percentage values, `props.percentageScale` should be `2`.
     * Must be an integer, otherwise throws an Error.
     */
    percentageScale: number;
}

export interface Props extends BaseProps, OwnProps {}

export class AmountPercentage extends React.PureComponent<Props> {
    static displayName = "AmountPercentage";

    render() {
        const {percentageScale, value, ...restProps} = this.props;
        const percentageValue = value !== null && value !== undefined ? value * 100 : value;
        return <Amount value={percentageValue} scale={percentageScale} postfix="%" {...restProps} />;
    }
}
