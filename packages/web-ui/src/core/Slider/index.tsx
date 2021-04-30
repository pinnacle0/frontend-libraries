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

    /**
     * If showButton, put max/min marker under our button instead of passing to antd min/max slider position
     */
    getMarks = () => {
        const {showButton, marks, max, min} = this.props;
        if (showButton) {
            const removeMinMaxMark = {...this.props.marks};
            delete removeMinMaxMark[min!];
            delete removeMinMaxMark[max!];
            return removeMinMaxMark;
        }
        return marks;
    };

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
        const {showButton, onChange, value, min, max, step = 1, marks, className, ...rest} = this.props;

        return (
            <span className={`g-slider ${showButton ? "show-button" : ""} ${className || ""}`}>
                {showButton && (
                    <div className="slider-button-wrapper">
                        <Button onClick={() => this.onChange(value - step!)}>
                            <span className="squeeze">{"<"}</span>
                        </Button>
                        {marks?.[min!] && <span>{marks?.[min!]}</span>}
                    </div>
                )}
                <AntSlider range={false} {...rest} className="slider" value={value} onChange={this.onChange} marks={this.getMarks()} min={min} max={max} step={step} />
                {showButton && (
                    <div className="slider-button-wrapper">
                        <Button onClick={() => this.onChange(value + step!)}>
                            <span className="squeeze"> {">"}</span>
                        </Button>
                        {marks?.[max!] && <span>{marks?.[max!]}</span>}
                    </div>
                )}
            </span>
        );
    }
}
