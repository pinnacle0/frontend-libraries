import React from "react";
import {EnumRadio} from "./EnumRadio";
import type {Props as InitialNullableBaseProps} from "./EnumRadio/InitialNullable";
import type {Props as NullableBaseProps} from "./EnumRadio/Nullable";
import {PickOptional} from "../internal/type";
import {i18n} from "../internal/i18n/core";

type ExtractKey<Props> = Omit<Props, "list" | "translator">;

export interface Props<Nullable extends boolean> extends ExtractKey<InitialNullableBaseProps<boolean>>, Pick<NullableBaseProps<boolean>, "nullText" | "nullPositionIndex"> {
    nullable?: Nullable;
    trueText?: string;
    falseText?: string;
    trueOptionFirst?: boolean;
    disabled?: boolean;
    style?: React.CSSProperties;
    useButtonMode?: boolean;
}

export class BoolRadio<Nullable extends boolean> extends React.PureComponent<Props<Nullable>> {
    static displayName = "BoolRadio";
    static defaultProps: PickOptional<Props<false>> = {
        trueOptionFirst: true,
    };

    private readonly trueOptionFirstList = [true, false];
    private readonly falseOptionFirstList = [false, true];

    translator = (_: boolean): string => {
        const t = i18n();
        return _ ? this.props.trueText ?? t.yes : this.props.falseText ?? t.no;
    };

    render() {
        const {trueOptionFirst, nullable, nullText, nullPositionIndex, ...restProps} = this.props;
        const list = trueOptionFirst ? this.trueOptionFirstList : this.falseOptionFirstList;
        if (nullable) {
            return <EnumRadio.Nullable {...(restProps as ExtractKey<NullableBaseProps<boolean>>)} nullPositionIndex={nullPositionIndex} nullText={nullText} list={list} translator={this.translator} />;
        }
        return <EnumRadio.InitialNullable list={list} translator={this.translator} {...restProps} />;
    }
}
