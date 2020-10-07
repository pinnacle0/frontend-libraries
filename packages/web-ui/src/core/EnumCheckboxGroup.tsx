import React from "react";
import {Checkbox} from "./Checkbox";
import {ControlledFormValue} from "../internal/type";

interface Props<Enum extends string | boolean | number> extends ControlledFormValue<Enum[]> {
    list: readonly Enum[];
    translator: (enumValue: Enum) => string;
    disabledItems?: Enum[] | "all";
}

export class EnumCheckboxGroup<Enum extends string | boolean | number> extends React.PureComponent<Props<Enum>> {
    static displayName = "EnumCheckboxGroup";

    render() {
        const {list, translator, disabledItems, value, onChange} = this.props;
        const options = list.map(_ => ({
            label: translator(_),
            value: _,
            disabled: disabledItems ? disabledItems === "all" || disabledItems.includes(_) : false,
        }));
        return <Checkbox.Group options={options} value={value} onChange={onChange as any} />;
    }
}
