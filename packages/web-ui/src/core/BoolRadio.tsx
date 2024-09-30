import React from "react";
import {EnumRadio} from "./EnumRadio";
import type {PickOptional, ControlledFormValue} from "../internal/type";
import type {RadioGroupButtonStyle} from "antd/es/radio";
import {i18n} from "../internal/i18n/core";

export interface Props<AllowNull extends boolean> extends ControlledFormValue<AllowNull extends false ? boolean : boolean | null> {
    allowNull?: AllowNull;
    trueText?: string;
    falseText?: string;
    trueOptionFirst?: boolean;
    useButtonMode?: boolean;
    buttonStyle?: RadioGroupButtonStyle;
    disabled?: boolean;
    className?: string;
    style?: React.CSSProperties;
}

export class BoolRadio<AllowNull extends boolean> extends React.PureComponent<Props<AllowNull>> {
    static displayName = "BoolRadio";
    static defaultProps: PickOptional<Props<false>> = {
        trueOptionFirst: true,
    };

    private readonly trueOptionFirstList = [true, false];
    private readonly falseOptionFirstList = [false, true];

    translator = (_: boolean): string => {
        const t = i18n();
        return _ ? (this.props.trueText ?? t.yes) : (this.props.falseText ?? t.no);
    };

    render() {
        const {trueOptionFirst, allowNull, value, onChange, useButtonMode, buttonStyle, disabled, className, style} = this.props;
        const list = trueOptionFirst ? this.trueOptionFirstList : this.falseOptionFirstList;
        if (allowNull) {
            return (
                <EnumRadio.Nullable
                    list={list}
                    translator={this.translator}
                    value={value as boolean | null}
                    onChange={onChange as (_: boolean | null) => void}
                    useButtonMode={useButtonMode}
                    buttonStyle={buttonStyle}
                    disabled={disabled}
                    className={className}
                    style={style}
                />
            );
        } else {
            return (
                <EnumRadio
                    list={list}
                    translator={this.translator}
                    value={value as boolean}
                    onChange={onChange as (_: boolean) => void}
                    useButtonMode={useButtonMode}
                    buttonStyle={buttonStyle}
                    disabled={disabled}
                    className={className}
                    style={style}
                />
            );
        }
    }
}
