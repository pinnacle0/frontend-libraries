import React from "react";
import type {BaseProps} from "./index";
import {EnumRadio} from "./index";
import type {ControlledFormValue} from "../../internal/type";
import {i18n} from "../../internal/i18n/core";
import {ReactUtil} from "../../util/ReactUtil";

const NULL_VALUE = "@@NULL";
type NullType = typeof NULL_VALUE;

export interface Props<Enum extends string | boolean | number> extends BaseProps<Enum>, ControlledFormValue<Enum | null> {
    nullText?: React.ReactElement | string | number | null;
    nullPositionIndex?: number;
}

export const Nullable = ReactUtil.memo("Nullable", <Enum extends string | boolean | number>(props: Props<Enum>) => {
    const {value, onChange, nullText, nullPositionIndex, list, translator, ...restProps} = props;
    const t = i18n();

    const wrappedValue = value === null ? NULL_VALUE : value;
    const wrappedOnChange = (value: Enum | NullType) => onChange(value === NULL_VALUE ? null : value);

    const wrappedList: Array<Enum | NullType> = [...list];
    wrappedList.splice(nullPositionIndex || 0, 0, NULL_VALUE);

    const wrappedTranslator = (value: Enum | NullType) => (value === NULL_VALUE ? (nullText ?? t.all) : translator ? translator(value) : value.toString());

    return <EnumRadio value={wrappedValue} onChange={wrappedOnChange} list={wrappedList} translator={wrappedTranslator} {...restProps} />;
});
