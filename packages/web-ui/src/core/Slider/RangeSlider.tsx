import React from "react";
import type {SliderRangeProps} from "antd/es/slider";
import AntSlider from "antd/es/slider";
import type {ControlledFormValue} from "../../internal/type";
import {ReactUtil} from "../../util/ReactUtil";

export interface RangeProps extends Omit<SliderRangeProps, "range" | "value" | "onChange">, ControlledFormValue<[number, number]> {
    draggable?: boolean;
}

export const RangeSlider = ReactUtil.memo("RangeSlider", ({draggable, onChange, ...rest}: RangeProps) => {
    return <AntSlider range={{draggableTrack: draggable}} onChange={(x: number[]) => onChange(x as [number, number])} {...rest} />;
});
