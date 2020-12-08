import React from "react";
import {EnumRadio} from "./EnumRadio";
import type {Props as BaseProps} from "./EnumRadio/InitialNullable";
import {ControlledFormValue, PickOptional} from "../internal/type";
import {i18n} from "../internal/i18n/core";

export interface Props extends Omit<BaseProps<boolean>, "list" | "translator"> {
    trueText?: string;
    falseText?: string;
    trueOptionFirst?: boolean;
    disabled?: boolean;
    style?: React.CSSProperties;
    useButtonMode?: boolean;
}

export class BoolRadio extends React.PureComponent<Props> {
    static displayName = "BoolRadio";
    static defaultProps: PickOptional<Props> = {
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
        return <EnumRadio.InitialNullable list={list} translator={this.translator} {...restProps} />;
    }
}
