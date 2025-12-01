import React from "react";
import type {ControlledFormValue} from "../../internal/type";
import {i18n} from "../../internal/i18n/core";
import type {CascaderDataNode, BaseProps} from "./index";
import {Cascader} from "./index";
import {ReactUtil} from "../../util/ReactUtil";

const NULL_VALUE = "@@NULL";
type NullType = typeof NULL_VALUE;

export interface Props<T extends string | number> extends BaseProps<T>, ControlledFormValue<T | null> {
    nullText?: string;
}

export const Nullable = ReactUtil.memo("Nullable", <T extends string | number>(props: Props<T>) => {
    const {nullText, data, value, onChange, ...restProps} = props;
    const t = i18n();

    const wrappedData: Array<CascaderDataNode<T | NullType>> = [{label: nullText || t.all, value: NULL_VALUE}, ...data];
    const wrappedValue: T | NullType = value === null ? NULL_VALUE : value;
    const wrappedOnChange = (newValue: T | NullType) => onChange(newValue === NULL_VALUE ? null : newValue);

    return <Cascader data={wrappedData} value={wrappedValue} onChange={wrappedOnChange} {...restProps} />;
});
