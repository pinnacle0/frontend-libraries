import React from "react";
import type {BaseProps} from "./index";
import {EnumSelect} from "./index";
import {ReactUtil} from "../../util/ReactUtil";

export interface Props<Enum extends string | boolean | number> extends BaseProps<Enum> {
    value: Enum | null;
    onChange: (newValue: Enum) => void;
}

export const InitialNullable = ReactUtil.memo("InitialNullable", <Enum extends string | boolean | number>({value, ...restProps}: Props<Enum>) => {
    return <EnumSelect value={value as Enum} {...restProps} />;
});
