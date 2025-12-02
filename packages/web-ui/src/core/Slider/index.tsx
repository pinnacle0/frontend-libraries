import React from "react";
import AntSlider from "antd/es/slider";
import {classNames} from "../../util/ClassNames";
import {Button} from "../Button";
import {RangeSlider} from "./RangeSlider";
import type {SliderSingleProps} from "antd/es/slider";
import type {ControlledFormValue} from "../../internal/type";
import "./index.less";
import {ReactUtil} from "../../util/ReactUtil";

interface Props extends Omit<SliderSingleProps, "range" | "value" | "onChange">, ControlledFormValue<number> {
    showButton?: boolean;
}

export const Slider = ReactUtil.compound("Slider", {Range: RangeSlider}, (props: Props) => {
    const {showButton, onChange, value, step, className, ...restProps} = props;
    const safeStep = step || 1;

    const onAntChange = (newValue: number) => {
        const {min, max} = restProps;
        if (max && newValue > max) {
            onChange(max);
        } else if (min && newValue < min) {
            onChange(min);
        } else {
            onChange(newValue);
        }
    };

    return (
        <span className={classNames("g-slider", className)}>
            {showButton && (
                <Button className="decrease-button" onClick={() => onAntChange(value - safeStep)}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="4.073" height="7.802" viewBox="0 0 4.073 7.802">
                        <path
                            data-name="路径 12"
                            d="M-5.76.578a.365.365 0 0 1 .052-.5.332.332 0 0 1 .479.055l2.3 2.982a.472.472 0 0 1 0 .572l-2.3 2.982a.332.332 0 0 1-.479.055.365.365 0 0 1-.052-.5L-3.586 3.4z"
                            transform="translate(6.381 .501)"
                        />
                    </svg>
                </Button>
            )}
            <AntSlider range={false} value={value} onChange={onAntChange} step={safeStep} {...restProps} />
            {showButton && (
                <Button className="increase-button" onClick={() => onAntChange(value + safeStep)}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="4.073" height="7.802" viewBox="0 0 4.073 7.802">
                        <path
                            data-name="路径 12"
                            d="M-5.76.578a.365.365 0 0 1 .052-.5.332.332 0 0 1 .479.055l2.3 2.982a.472.472 0 0 1 0 .572l-2.3 2.982a.332.332 0 0 1-.479.055.365.365 0 0 1-.052-.5L-3.586 3.4z"
                            transform="translate(6.381 .501)"
                        />
                    </svg>
                </Button>
            )}
        </span>
    );
});
