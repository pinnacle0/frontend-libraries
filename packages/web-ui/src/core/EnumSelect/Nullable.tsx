import React from "react";
import type {BaseProps} from "./index";
import {EnumSelect} from "./index";
import type {ControlledFormValue} from "../../internal/type";
import {i18n} from "../../internal/i18n/core";

type NullType = "@@NULL";

export interface Props<Enum extends string | boolean | number> extends BaseProps<Enum>, ControlledFormValue<Enum | null> {
    nullText?: React.ReactChild;
    nullPositionIndex?: number;
}

export class Nullable<Enum extends string | boolean | number> extends React.PureComponent<Props<Enum>> {
    // eslint-disable-next-line @pinnacle0/react-component-display-name -- inner static component
    static displayName = "EnumSelect.Nullable";

    private readonly nullValue: NullType = "@@NULL";

    render() {
        const {value, onChange, nullText, nullPositionIndex, list, translator, ...restProps} = this.props;
        const t = i18n();

        const wrappedValue = value === null ? this.nullValue : value;
        const wrappedOnChange = (value: Enum | NullType) => onChange(value === this.nullValue ? null : value);
        const wrappedList: Array<Enum | NullType> = [...list];
        wrappedList.splice(nullPositionIndex || 0, 0, this.nullValue);
        const wrappedTranslator = (value: Enum | NullType) => (value === this.nullValue ? nullText ?? t.all : translator(value));

        return <EnumSelect value={wrappedValue} onChange={wrappedOnChange} list={wrappedList} translator={wrappedTranslator} {...restProps} />;
    }
}
