import React from "react";
import {EnumSelect} from "./EnumSelect";
import type {Props as BaseProps} from "./EnumSelect/InitialNullable";
import type {PickOptional} from "../internal/type";
import {i18n} from "../internal/i18n/core";

export interface Props extends Omit<BaseProps<boolean>, "list" | "translator"> {
    trueText?: string;
    falseText?: string;
    trueOptionFirst?: boolean;
    disabled?: boolean;
    style?: React.CSSProperties;
}

export class BoolSelect extends React.PureComponent<Props> {
    static displayName = "BoolSelect";
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
        return <EnumSelect.InitialNullable list={list} translator={this.translator} {...restProps} />;
    }
}
