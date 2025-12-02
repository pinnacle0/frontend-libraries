import {ReactUtil} from "../../util/ReactUtil";
import type {Props as SelectProps, SelectValue, SelectOptionProps} from "../Select";
import {Select} from "../Select";
import React from "react";

export interface Props<ValueType extends SelectValue> extends Omit<SelectProps<ValueType>, "optionLabelProp"> {}

export const LabelledSelect = ReactUtil.compound(
    "LabelledSelect",
    {Option: Select.Option as React.ComponentType<SelectOptionProps & {label: string}>},
    <ValueType extends SelectValue>(props: Props<ValueType>) => {
        return <Select optionLabelProp="label" {...props} />;
    }
);
