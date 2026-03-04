import React from "react";
import RcSlider from "@rc-component/slider";
import "@rc-component/slider/assets/index.css";
import {classNames} from "../../util/ClassNames";
import {Button} from "../Button";
import {RangeSlider} from "./RangeSlider";
import type {ControlledFormValue} from "../../internal/type";
import "./index.less";
import {ReactUtil} from "../../util/ReactUtil";

interface Props extends ControlledFormValue<number> {
    showButton?: boolean;
    min?: number;
    max?: number;
    step?: number;
    disabled?: boolean;
    vertical?: boolean;
    dots?: boolean;
    included?: boolean;
    marks?: Record<number, React.ReactNode>;
    className?: string;
    style?: React.CSSProperties;
    tooltip?: {open?: boolean; formatter?: (value?: number) => React.ReactNode};
}

export const Slider = ReactUtil.compound("Slider", {Range: RangeSlider}, (props: Props) => {
    const {showButton, onChange, value, step, className, min, max, disabled, ...restProps} = props;
    const safeStep = step || 1;

    const onSliderChange = (newValue: number | number[]) => {
        const v = Array.isArray(newValue) ? newValue[0] : newValue;
        if (max && v > max) {
            onChange(max);
        } else if (min && v < min) {
            onChange(min);
        } else {
            onChange(v);
        }
    };

    return (
        <span className={classNames("g-slider", className)}>
            {showButton && (
                <Button className="decrease-button" onClick={() => onSliderChange(value - safeStep)}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="4.073" height="7.802" viewBox="0 0 4.073 7.802">
                        <path
                            data-name="路径 12"
                            d="M-5.76.578a.365.365 0 0 1 .052-.5.332.332 0 0 1 .479.055l2.3 2.982a.472.472 0 0 1 0 .572l-2.3 2.982a.332.332 0 0 1-.479.055.365.365 0 0 1-.052-.5L-3.586 3.4z"
                            transform="translate(6.381 .501)"
                        />
                    </svg>
                </Button>
            )}
            <RcSlider value={value} onChange={onSliderChange} step={safeStep} min={min} max={max} disabled={disabled} {...restProps} />
            {showButton && (
                <Button className="increase-button" onClick={() => onSliderChange(value + safeStep)}>
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
