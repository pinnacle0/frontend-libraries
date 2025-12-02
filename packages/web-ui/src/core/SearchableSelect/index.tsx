import {ReactUtil} from "../../util/ReactUtil";
import type {Props as SelectProps, SelectValue, SelectOptionProps} from "../Select";
import {Select} from "../Select";
import React from "react";

export interface Props<ValueType extends SelectValue> extends Omit<SelectProps<ValueType>, "optionFilterProp" | "showSearch" | "optionLabelProp" | "options"> {
    options?: Array<{value: string; label: string}>;
}

export const SearchableSelect = ReactUtil.compound(
    "SearchableSelect",
    {Option: Select.Option as React.ComponentType<SelectOptionProps & {children: string}>},
    <ValueType extends SelectValue>(props: Props<ValueType>) => {
        return <Select showSearch={{optionFilterProp: props.options ? "label" : "children"}} {...props} />;
    }
);
