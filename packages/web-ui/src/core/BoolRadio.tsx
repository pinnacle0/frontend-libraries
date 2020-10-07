import React from "react";
import {EnumRadio} from "./EnumRadio";
import {ControlledFormValue, PickOptional} from "../internal/type";
import {i18n} from "../internal/i18n/core";

export interface Props<Text extends string | false> extends ControlledFormValue<Text extends false ? boolean : boolean | null> {
    allowNull: Text;
    trueText?: string;
    falseText?: string;
    trueOptionFirst?: boolean;
    disabled?: boolean;
    style?: React.CSSProperties;
    useButtonMode?: boolean;
}

export class BoolRadio<T extends string | false> extends React.PureComponent<Props<T>> {
    static displayName = "BoolRadio";
    static defaultProps: PickOptional<Props<any>> = {
        trueOptionFirst: true,
    };

    private readonly trueOptionFirstList = [true, false];
    private readonly falseOptionFirstList = [false, true];

    translator = (_: boolean) => {
        const t = i18n();
        return _ ? this.props.trueText || t.yes : this.props.falseText || t.no;
    };

    render() {
        const {trueOptionFirst, ...restProps} = this.props;
        const list = trueOptionFirst ? this.trueOptionFirstList : this.falseOptionFirstList;
        return <EnumRadio list={list} translator={this.translator} {...restProps} />;
    }
}
