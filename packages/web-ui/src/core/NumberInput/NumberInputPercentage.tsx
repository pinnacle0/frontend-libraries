import React from "react";
import {classNames} from "../../util/ClassNames";
import {NumberInput} from "./index";
import {truncate} from "./util";
import type {Props as NumberInputProps} from "./index";
import {ReactUtil} from "../../util/ReactUtil";

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

export const NumberInputPercentage = ReactUtil.memo("NumberInputPercentage", <AllowNull extends boolean>(props: Props<AllowNull>) => {
    const {value, percentageScale = 0, percentageStep, min = 0, max = 1, onChange, className, ...restProps} = props;

    const onPercentageChange: Props<AllowNull>["onChange"] = newPercentageValue => {
        const scale = percentageScale + 2;
        const newValue = typeof newPercentageValue === "number" ? truncate(newPercentageValue / 100, scale) : newPercentageValue;
        onChange(newValue);
    };

    const percentageValue = (typeof value === "number" ? value * 100 : value) as AllowNull extends true ? number | null : number;
    return (
        <NumberInput<AllowNull>
            className={classNames("percentage", className)}
            value={percentageValue}
            onChange={onPercentageChange}
            min={min * 100}
            max={max * 100}
            scale={percentageScale}
            step={percentageStep}
            displayRenderer={_ => `${_.toFixed(percentageScale)} %`}
            {...restProps}
        />
    );
});
