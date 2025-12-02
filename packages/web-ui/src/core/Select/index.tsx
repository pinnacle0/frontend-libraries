import AntSelect from "antd/es/select";
import React from "react";
import type {SelectProps, SelectValue, DefaultOptionType, OptionProps as SelectOptionProps} from "antd/es/select";
import {ReactUtil} from "../../util/ReactUtil";

export type {SelectValue, SelectOptionProps};
export interface Props<ValueType extends SelectValue> extends Omit<SelectProps<ValueType>, "options"> {
    options?: Array<DefaultOptionType>;
}

// Antd will check Select children displayName to validate children, cannot use ReactUtil.compound here.
const Option: typeof AntSelect.Option = AntSelect.Option;
const OptGroup: typeof AntSelect.OptGroup = AntSelect.OptGroup;

const InternalSelect = ReactUtil.memo("Select", <ValueType extends SelectValue>(props: Props<ValueType>) => {
    return <AntSelect {...props} />;
});

export const Select: typeof InternalSelect & {Option: typeof Option; OptGroup: typeof OptGroup} = Object.assign(InternalSelect, {Option, OptGroup});
