import React from "react";
import type {BaseProps} from "./index";
import {EnumRadio} from "./index";
import type {ControlledFormValue} from "../../internal/type";
import {i18n} from "../../internal/i18n/core";

type NullType = "@@NULL";

export interface Props<Enum extends string | boolean | number> extends BaseProps<Enum>, ControlledFormValue<Enum | null> {
    nullText?: React.ReactElement | string | number | null;
    nullPositionIndex?: number;
}

export class Nullable<Enum extends string | boolean | number> extends React.PureComponent<Props<Enum>> {
    static displayName = "EnumRadio.Nullable";

    private readonly nullValue: NullType = "@@NULL";

    render() {
        const {value, onChange, nullText, nullPositionIndex, list, translator, ...restProps} = this.props;
        const t = i18n();

        const wrappedValue = value === null ? this.nullValue : value;
        const wrappedOnChange = (value: Enum | NullType) => onChange(value === this.nullValue ? null : value);
        const wrappedList: Array<Enum | NullType> = [...list];
        wrappedList.splice(nullPositionIndex || 0, 0, this.nullValue);
        const wrappedTranslator = (value: Enum | NullType) => (value === this.nullValue ? (nullText ?? t.all) : translator ? translator(value) : value.toString());

        return <EnumRadio value={wrappedValue} onChange={wrappedOnChange} list={wrappedList} translator={wrappedTranslator} {...restProps} />;
    }
}
