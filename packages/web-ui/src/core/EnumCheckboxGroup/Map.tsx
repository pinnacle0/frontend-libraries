import React from "react";
import {EnumCheckboxGroup} from "./index";
import {ControlledFormValue} from "../../internal/type";

export interface Props<Enum extends string> extends ControlledFormValue<Enum[]> {
    map: Record<Enum, React.ReactChild>;
    disabledItems?: Enum[] | "all";
}

export class Map<Enum extends string> extends React.PureComponent<Props<Enum>> {
    // eslint-disable-next-line @pinnacle0/react-component-display-name -- inner static component
    static displayName = "EnumCheckboxGroup.Map";

    render() {
        const {map, ...restProps} = this.props;

        const list: Enum[] = Object.keys(map) as Enum[];
        const translator = (_: Enum) => map[_];

        return <EnumCheckboxGroup list={list} translator={translator} {...restProps} />;
    }
}
