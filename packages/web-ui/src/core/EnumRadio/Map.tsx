import React from "react";
import type {BaseProps} from "./index";
import {EnumRadio} from "./index";
import type {ControlledFormValue} from "../../internal/type";

export interface Props<Enum extends string> extends Omit<BaseProps<any>, "list" | "translator">, ControlledFormValue<Enum> {
    map: Record<Enum, React.ReactElement | string | number | null>;
}

export class Map<Enum extends string> extends React.PureComponent<Props<Enum>> {
    static displayName = "EnumRadio.Map";

    render() {
        const {map, ...restProps} = this.props;

        const list: Enum[] = Object.keys(map) as Enum[];
        const translator = (_: Enum) => map[_];

        return <EnumRadio list={list} translator={translator} {...restProps} />;
    }
}
