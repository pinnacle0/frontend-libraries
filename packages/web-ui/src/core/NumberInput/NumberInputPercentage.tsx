import React from "react";
import {classNames} from "../../util/ClassNames";
import {NumberInput} from "./index";
import {truncate} from "./util";
import type {PickOptional} from "../../internal/type";
import type {Props as NumberInputProps} from "./index";

type OmitPropsKeys = "displayRenderer" | "scale" | "step" | "min" | "max" | "value" | "onChange";

export interface Props<AllowNull extends boolean> extends Omit<NumberInputProps<AllowNull>, OmitPropsKeys> {
    /**
     * Number of decimal points used for **percentage** values.
     *
     * Default value: `0`
     *
     * To use 2 decimal points (eg 12.34%) in percentage values, `props.percentageScale` should be `2`.
     * Must be an integer, otherwise throws an Error.
     */
    percentageScale?: number;

    /**
     * Amount to increment/decrement by in **percentage** values.
     *
     * Default value is based on `props.percentageScale`:
     * ```txt
     * | % scale     | default % step |
     * |-------------|----------------|
     * |      0      |     1 (1%)     |
     * |      1      |   0.1 (0.1%)   |
     * |      2      |  0.01 (0.01%)  |
     * ```
     */
    percentageStep?: number;

    /**
     * Minimum value in **decimal** number.
     * Default value: `0`
     * If the minimum is `10%`, then `props.min` should be `0.1`.
     */
    min?: number;

    /**
     * Maximum value in **decimal** number.
     * Default value: `1`
     * If the maximum is `90%`, then `props.max` should be `0.9`.
     */
    max?: number;

    /**
     * Value of input field in **decimal** number.
     * If the value is `20%`, then `props.value` should be `0.2`.
     */
    value: AllowNull extends true ? number | null : number;

    /**
     * Callback when value of input field changed in **decimal** number.
     * If the new value is `30%`, then the argument `newValue` will be `0.3`.
     */
    onChange: (newValue: AllowNull extends true ? number | null : number) => void;
}

export class NumberInputPercentage<AllowNull extends boolean> extends React.PureComponent<Props<AllowNull>> {
    static displayName = "NumberInputPercentage";

    static defaultProps: PickOptional<Props<any>> = {
        percentageScale: 0,
        min: 0,
        max: 1,
    };

    percentageDisplayRenderer = (value: number) => {
        const percentageValue = value;
        const percentageScale = this.props.percentageScale!;
        return `${percentageValue.toFixed(percentageScale)} %`;
    };

    onPercentageChange: Props<AllowNull>["onChange"] = newPercentageValue => {
        const scale = this.props.percentageScale! + 2;
        const onChange = this.props.onChange as (newValue: number | null) => void;
        const newValue = typeof newPercentageValue === "number" ? truncate(newPercentageValue / 100, scale) : newPercentageValue;
        onChange(newValue);
    };

    render() {
        const {percentageScale, percentageStep, min, max, value, onChange, className, ...restProps} = this.props;
        const percentageValue = (typeof value === "number" ? value * 100 : value) as AllowNull extends true ? number | null : number;
        const percentageMin = min! * 100;
        const percentageMax = max! * 100;
        return (
            <NumberInput<AllowNull>
                className={classNames("percentage", className)}
                value={percentageValue}
                onChange={this.onPercentageChange}
                min={percentageMin}
                max={percentageMax}
                scale={percentageScale}
                step={percentageStep}
                displayRenderer={this.percentageDisplayRenderer}
                {...restProps}
            />
        );
    }
}
