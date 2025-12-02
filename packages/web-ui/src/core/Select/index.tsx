import AntSelect from "antd/es/select";
import React from "react";
import type {SelectProps, SelectValue, DefaultOptionType, OptionProps as SelectOptionProps} from "antd/es/select";
import {ReactUtil} from "../../util/ReactUtil";

export type {SelectValue, SelectOptionProps};
export interface Props<ValueType extends SelectValue> extends Omit<SelectProps<ValueType>, "options"> {
    options?: Array<DefaultOptionType>;
}

export const Select = ReactUtil.compound(
    "Select",
    {Option: AntSelect.Option as typeof AntSelect.Option, OptGroup: AntSelect.OptGroup as typeof AntSelect.OptGroup},
    <ValueType extends SelectValue>(props: Props<ValueType>) => {
        return <AntSelect {...props} />;
    }
);
