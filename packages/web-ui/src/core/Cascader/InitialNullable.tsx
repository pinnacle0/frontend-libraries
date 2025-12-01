import React from "react";
import type {BaseProps} from "./index";
import {Cascader} from "./index";
import {ReactUtil} from "../../util/ReactUtil";

export interface Props<T extends string | number> extends BaseProps<T> {
    value: T | null;
    onChange: (newValue: T) => void;
}

export const InitialNullable = ReactUtil.memo("InitialNullable", <T extends string | number>(props: Props<T>) => {
    const {value, ...restProps} = props;
    return <Cascader value={value as T} {...restProps} />;
});
