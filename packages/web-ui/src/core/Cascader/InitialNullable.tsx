import React from "react";
import type {BaseProps} from "./index";
import {Cascader} from "./index";

export interface Props<T extends string | number> extends BaseProps<T> {
    value: T | null;
    onChange: (newValue: T) => void;
}

export class InitialNullable<T extends string | number> extends React.PureComponent<Props<T>> {
    static displayName = "EnumSelect.InitialNullable";

    render() {
        const {value, ...restProps} = this.props;

        const wrappedValue = value as T;

        return <Cascader value={wrappedValue} {...restProps} />;
    }
}
