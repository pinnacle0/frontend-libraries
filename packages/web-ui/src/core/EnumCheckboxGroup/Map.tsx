import React from "react";
import {EnumCheckboxGroup} from "./index";
import type {ControlledFormValue} from "../../internal/type";

export interface Props<Enum extends string> extends ControlledFormValue<Enum[]> {
    map: Record<Enum, React.ReactElement | string | number | null>;
    disabledItems?: Enum[] | "all";
}

export class Map<Enum extends string> extends React.PureComponent<Props<Enum>> {
    static displayName = "EnumCheckboxGroup.Map";

    render() {
        const {map, ...restProps} = this.props;

        const list: Enum[] = Object.keys(map) as Enum[];
        const translator = (_: Enum) => map[_];

        return <EnumCheckboxGroup list={list} translator={translator} {...restProps} />;
    }
}
