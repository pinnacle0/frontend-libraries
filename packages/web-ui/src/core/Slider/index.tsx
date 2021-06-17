import React from "react";
import type {SliderSingleProps} from "antd/lib/slider";
import AntSlider from "antd/lib/slider";
import type {ControlledFormValue} from "../../internal/type";
import {Button} from "../Button";
import {RangeSlider} from "./RangeSlider";
import "antd/lib/slider/style";
import "./index.less";

interface Props extends Omit<SliderSingleProps, "range" | "value" | "onChange">, ControlledFormValue<number> {
    showButton?: boolean;
}

export class Slider extends React.PureComponent<Props> {
    static displayName = "Slider";
    static Range = RangeSlider;

    onChange = (newValue: number) => {
        const {min, max, onChange} = this.props;
        if (max && newValue > max) {
            onChange(max);
        } else if (min && newValue < min) {
            onChange(min);
        } else {
            onChange(newValue);
        }
    };

    render() {
        const {showButton, onChange, value, step, className, ...rest} = this.props;
        const safeStep = step || 1;

        return (
            <span className={`g-slider ${className || ""}`}>
                {showButton && (
                    <Button className="decrease-button" onClick={() => this.onChange(safeStep)}>
                        <span>{"<"}</span>
                    </Button>
                )}
                <AntSlider range={false} value={value} onChange={this.onChange} step={safeStep} {...rest} />
                {showButton && (
                    <Button className="increase-button" onClick={() => this.onChange(safeStep)}>
                        <span>{">"}</span>
                    </Button>
                )}
            </span>
        );
    }
}
