import React from "react";
import type {BaseProps} from "./index";
import {EnumSelect} from "./index";
import type {ControlledFormValue} from "../../internal/type";
import {ReactUtil} from "../../util/ReactUtil";

export interface Props<T extends string> extends Omit<BaseProps<any>, "list" | "translator">, ControlledFormValue<T> {
    map: Record<T, React.ReactElement | string | number | null>;
}

export const Map = ReactUtil.memo("Map", <T extends string>({map, ...restProps}: Props<T>) => {
    const list: T[] = Object.keys(map) as T[];
    const translator = (_: T) => map[_];
    return <EnumSelect list={list} translator={translator} {...restProps} />;
});
