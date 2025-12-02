import React from "react";
import {EnumCheckboxGroup} from "./index";
import type {ControlledFormValue} from "../../internal/type";
import {ReactUtil} from "../../util/ReactUtil";

export interface Props<Enum extends string> extends ControlledFormValue<Enum[]> {
    map: Record<Enum, React.ReactElement | string | number | null>;
    disabledItems?: Enum[] | "all";
}

export const Map = ReactUtil.memo("Map", <Enum extends string>({map, ...restProps}: Props<Enum>) => {
    const list: Enum[] = Object.keys(map) as Enum[];
    return <EnumCheckboxGroup list={list} translator={_ => map[_]} {...restProps} />;
});
