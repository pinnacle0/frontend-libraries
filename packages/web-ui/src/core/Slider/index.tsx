import React from "react";
import AntSlider from "antd/lib/slider";
import {classNames} from "../../util/ClassNames";
import {Button} from "../Button";
import {RangeSlider} from "./RangeSlider";
import type {SliderSingleProps} from "antd/lib/slider";
import type {ControlledFormValue} from "../../internal/type";
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
        const {
            showButton,
            // eslint-disable-next-line @typescript-eslint/no-unused-vars -- not included in restProps
            onChange,
            value,
            step,
            className,
            ...restProps
        } = this.props;
        const safeStep = step || 1;

        return (
            <span className={classNames("g-slider", className)}>
                {showButton && (
                    <Button className="decrease-button" onClick={() => this.onChange(value - safeStep)}>
                        <span>{"<"}</span>
                    </Button>
                )}
                <AntSlider range={false} value={value} onChange={this.onChange} step={safeStep} {...restProps} />
                {showButton && (
                    <Button className="increase-button" onClick={() => this.onChange(value + safeStep)}>
                        <span>{">"}</span>
                    </Button>
                )}
            </span>
        );
    }
}
