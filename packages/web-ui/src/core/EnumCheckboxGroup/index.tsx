import React from "react";
import {Checkbox} from "../Checkbox";
import type {ControlledFormValue} from "../../internal/type";
import {ReactUtil} from "../../util/ReactUtil";
import {Map} from "./Map";

interface Props<Enum extends string | boolean | number> extends ControlledFormValue<Enum[]> {
    list: readonly Enum[];
    translator?: (enumValue: Enum) => React.ReactElement | string | number | null;
    disabledItems?: Enum[] | "all";
}

export const EnumCheckboxGroup = ReactUtil.compound("EnumCheckboxGroup", {Map}, <Enum extends string | boolean | number>(props: Props<Enum>) => {
    const {list, translator, disabledItems, value, onChange} = props;
    const options = list.map(_ => ({
        label: translator ? translator(_) : _.toString(),
        value: _,
        disabled: disabledItems ? disabledItems === "all" || disabledItems.includes(_) : false,
    }));
    return <Checkbox.Group options={options} value={value} onChange={onChange as any} />;
});
