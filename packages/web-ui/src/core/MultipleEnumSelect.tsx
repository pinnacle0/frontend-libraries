import React from "react";
import {Select} from "./Select";
import type {ControlledFormValue} from "../internal/type";

interface Props<Enum extends string | number> extends ControlledFormValue<Enum[]> {
    list: Enum[];
    translator?: (enumValue: Enum) => string;
    disabled?: boolean;
    style?: React.CSSProperties;
}

export class MultipleEnumSelect<Enum extends string | number> extends React.PureComponent<Props<Enum>> {
    static displayName = "MultipleEnumSelect";

    getSelectOptions = () => {
        const {list, translator} = this.props;
        return list.map(value => ({
            value,
            label: translator ? translator(value) : value.toString(),
        }));
    };

    render() {
        const {disabled, value, onChange, style} = this.props;
        // antd: using options prop will get better perf than jsx definition
        return <Select mode="multiple" value={value} onChange={onChange} disabled={disabled} style={style} options={this.getSelectOptions()} optionFilterProp="label" />;
    }
}
