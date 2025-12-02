import React from "react";
import type {BaseProps} from "./index";
import {EnumRadio} from "./index";
import type {ControlledFormValue} from "../../internal/type";
import {ReactUtil} from "../../util/ReactUtil";

export interface Props<Enum extends string> extends Omit<BaseProps<any>, "list" | "translator">, ControlledFormValue<Enum> {
    map: Record<Enum, React.ReactElement | string | number | null>;
}

export const Map = ReactUtil.memo("Map", <Enum extends string>({map, ...restProps}: Props<Enum>) => {
    const list: Enum[] = Object.keys(map) as Enum[];
    const translator = (_: Enum) => map[_];
    return <EnumRadio list={list} translator={translator} {...restProps} />;
});
