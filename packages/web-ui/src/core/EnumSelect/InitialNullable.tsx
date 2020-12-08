import React from "react";
import {EnumSelect, BaseProps} from "./index";

export interface Props<Enum extends string | boolean | number> extends BaseProps<Enum> {
    value: Enum | null;
    onChange: (newValue: Enum) => void;
}

export class InitialNullable<Enum extends string | boolean | number> extends React.PureComponent<Props<Enum>> {
    // eslint-disable-next-line @pinnacle0/react-component-display-name -- inner static component
    static displayName = "EnumSelect.InitialNullable";

    render() {
        const {value, ...restProps} = this.props;

        const wrappedValue = (value === null ? "" : value) as Enum;

        return <EnumSelect value={wrappedValue} {...restProps} />;
    }
}
