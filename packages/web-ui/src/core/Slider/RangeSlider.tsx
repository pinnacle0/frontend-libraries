import React from "react";
import RcSlider from "@rc-component/slider";
import type {ControlledFormValue} from "../../internal/type";
import {ReactUtil} from "../../util/ReactUtil";

export interface RangeProps extends ControlledFormValue<[number, number]> {
    draggable?: boolean;
    min?: number;
    max?: number;
    step?: number;
    disabled?: boolean;
    vertical?: boolean;
    marks?: Record<number, React.ReactNode>;
    className?: string;
    style?: React.CSSProperties;
}

export const RangeSlider = ReactUtil.memo("RangeSlider", ({draggable, onChange, value, ...rest}: RangeProps) => {
    return <RcSlider range={draggable ? {draggableTrack: true} : true} value={value} onChange={(x: number | number[]) => onChange(x as [number, number])} {...rest} />;
});
