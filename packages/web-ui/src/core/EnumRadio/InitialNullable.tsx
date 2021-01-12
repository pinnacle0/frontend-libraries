import React from "react";
import type {BaseProps} from "./index";
import {EnumRadio} from "./index";

type NullType = "@@NULL";

export interface Props<Enum extends string | boolean | number> extends BaseProps<Enum> {
    value: Enum | null;
    onChange: (newValue: Enum) => void;
}

export class InitialNullable<Enum extends string | boolean | number> extends React.PureComponent<Props<Enum>> {
    // eslint-disable-next-line @pinnacle0/react-component-display-name -- inner static component
    static displayName = "EnumRadio.InitialNullable";

    private readonly nullValue: NullType = "@@NULL";

    render() {
        const {value, ...restProps} = this.props;

        const wrappedValue = (value === null ? this.nullValue : value) as Enum; // nullValue does not exist in list, so no Radio will be selected

        return <EnumRadio value={wrappedValue} {...restProps} />;
    }
}
