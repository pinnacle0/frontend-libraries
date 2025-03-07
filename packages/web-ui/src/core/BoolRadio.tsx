import React from "react";
import {EnumRadio} from "./EnumRadio";
import type {ControlledFormValue} from "../internal/type";
import type {RadioGroupButtonStyle} from "antd/es/radio";
import {i18n} from "../internal/i18n/core";
import {ReactUtil} from "../util/ReactUtil";

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

export const BoolRadio = ReactUtil.memo("BoolRadio", (props: Props<any>) => {
    const {trueOptionFirst = true, allowNull, value, onChange, useButtonMode, buttonStyle, disabled, className, style, trueText, falseText} = props;
    const list = trueOptionFirst ? [true, false] : [false, true];

    const translator = (_: boolean): string => {
        const t = i18n();
        return _ ? (trueText ?? t.yes) : (falseText ?? t.no);
    };

    if (allowNull) {
        return (
            <EnumRadio.Nullable
                list={list}
                translator={translator}
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
                translator={translator}
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
});
