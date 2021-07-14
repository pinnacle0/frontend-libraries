import React from "react";
import type {ControlledFormValue} from "../../internal/type";
import {i18n} from "../../internal/i18n/core";
import type {CascaderDataNode, BaseProps} from "./index";
import {Cascader} from "./index";

type NullType = "@@NULL";

interface Props<T extends string | number> extends BaseProps<T>, ControlledFormValue<T | null> {
    nullText?: string;
}

export class Nullable<T extends string> extends React.PureComponent<Props<T>> {
    static displayName = "Cascader.Nullable";

    private readonly nullValue: NullType = "@@NULL";

    override render() {
        const {nullText, data, value, onChange, ...restProps} = this.props;
        const t = i18n();

        const wrappedData: Array<CascaderDataNode<T | NullType>> = [{label: nullText || t.all, value: this.nullValue}, ...data];
        const wrappedValue: T | NullType = value === null ? this.nullValue : value;
        const wrappedOnChange = (newValue: T | NullType) => onChange(newValue === this.nullValue ? null : newValue);

        return <Cascader data={wrappedData} value={wrappedValue} onChange={wrappedOnChange} {...restProps} />;
    }
}
