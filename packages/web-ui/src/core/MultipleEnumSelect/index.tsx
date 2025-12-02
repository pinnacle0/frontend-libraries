import React from "react";
import {Select} from "../Select";
import type {ControlledFormValue} from "../../internal/type";
import {ReactUtil} from "../../util/ReactUtil";

interface Props<Enum extends string | number> extends ControlledFormValue<Enum[]> {
    list: Enum[];
    maxShownTagCount?: number;
    translator?: (enumValue: Enum) => string;
    disabled?: boolean;
    style?: React.CSSProperties;
}

export const MultipleEnumSelect = ReactUtil.memo("MultipleEnumSelect", <Enum extends string | number>(props: Props<Enum>) => {
    const {list, translator, disabled, style, value, onChange, maxShownTagCount} = props;
    const options = list.map(value => ({
        value,
        label: translator ? translator(value) : value.toString(),
    }));

    return <Select mode="multiple" value={value} maxTagCount={maxShownTagCount} onChange={onChange} disabled={disabled} style={style} options={options} showSearch={{optionFilterProp: "label"}} />;
});
