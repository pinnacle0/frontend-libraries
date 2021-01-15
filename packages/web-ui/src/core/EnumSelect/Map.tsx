import React from "react";
import type {BaseProps} from "./index";
import {EnumSelect} from "./index";
import type {ControlledFormValue} from "../../internal/type";

export interface Props<T extends string> extends Omit<BaseProps<any>, "list" | "translator">, ControlledFormValue<T> {
    map: Record<T, React.ReactChild>;
}

export class Map<T extends string> extends React.PureComponent<Props<T>> {
    static displayName = "EnumSelect.Map";

    render() {
        const {map, ...restProps} = this.props;

        const list: T[] = Object.keys(map) as T[];
        const translator = (_: T) => map[_];

        return <EnumSelect list={list} translator={translator} {...restProps} />;
    }
}
