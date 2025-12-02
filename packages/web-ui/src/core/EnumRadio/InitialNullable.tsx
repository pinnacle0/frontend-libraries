import React from "react";
import type {BaseProps} from "./index";
import {EnumRadio} from "./index";
import {ReactUtil} from "../../util/ReactUtil";

const NULL_VALUE = "@@NULL";

export interface Props<Enum extends string | boolean | number> extends BaseProps<Enum> {
    value: Enum | null;
    onChange: (newValue: Enum) => void;
}

export const InitialNullable = ReactUtil.memo("InitialNullable", <Enum extends string | boolean | number>({value, ...restProps}: Props<Enum>) => {
    const wrappedValue = (value === null ? NULL_VALUE : value) as Enum; // nullValue does not exist in list, so no Radio will be selected
    return <EnumRadio value={wrappedValue} {...restProps} />;
});
