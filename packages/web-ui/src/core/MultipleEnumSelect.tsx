import React from "react";
import {Select} from "./Select";
import {ControlledFormValue} from "../internal/type";

interface Props<Enum extends string | number> extends ControlledFormValue<Enum[]> {
    list: Enum[];
    translator: (enumValue: Enum) => string;
    disabled?: boolean;
    style?: React.CSSProperties;
    optionFilterProp?: string;
}

export class MultipleEnumSelect<Enum extends string | number> extends React.PureComponent<Props<Enum>> {
    static displayName = "MultipleEnumSelect";

    getSelectOptions = () => this.props.list.map(value => ({value, label: this.props.translator(value)}));

    render() {
        const {disabled, value, onChange, style, optionFilterProp} = this.props;
        // antd: using options prop will get better perf than jsx definition
        return <Select mode="multiple" value={value} onChange={onChange} disabled={disabled} style={style} options={this.getSelectOptions()} optionFilterProp={optionFilterProp} />;
    }
}
