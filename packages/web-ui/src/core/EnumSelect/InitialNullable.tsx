import React from "react";
import type {BaseProps} from "./index";
import {EnumSelect} from "./index";

export interface Props<Enum extends string | boolean | number> extends BaseProps<Enum> {
    value: Enum | null;
    onChange: (newValue: Enum) => void;
}

export class InitialNullable<Enum extends string | boolean | number> extends React.PureComponent<Props<Enum>> {
    static displayName = "EnumSelect.InitialNullable";

    render() {
        const {value, ...restProps} = this.props;

        const wrappedValue = (value === null ? undefined : value) as Enum;

        return <EnumSelect value={wrappedValue} {...restProps} />;
    }
}
