import React from "react";
import {EnumSelect} from "./EnumSelect";
import type {ControlledFormValue} from "../internal/type";
import {i18n} from "../internal/i18n/core";
import {ReactUtil} from "../util/ReactUtil";

export interface Props<AllowNull extends boolean> extends ControlledFormValue<AllowNull extends false ? boolean : boolean | null> {
    allowNull: AllowNull;
    trueText?: string;
    falseText?: string;
    trueOptionFirst?: boolean;
    disabled?: boolean;
    className?: string;
    style?: React.CSSProperties;
}

export const BoolSelect = ReactUtil.memo("BoolSelect", (props: Props<any>) => {
    const {trueOptionFirst = true, allowNull, value, onChange, disabled, className, style, trueText, falseText} = props;
    const list = trueOptionFirst ? [true, false] : [false, true];

    const translator = (_: boolean) => {
        const t = i18n();
        return _ ? trueText || t.yes : falseText || t.no;
    };

    if (allowNull) {
        return (
            <EnumSelect.Nullable
                list={list}
                translator={translator}
                value={value as boolean | null}
                onChange={onChange as (_: boolean | null) => void}
                disabled={disabled}
                className={className}
                style={style}
            />
        );
    } else {
        return <EnumSelect list={list} translator={translator} value={value as boolean} onChange={onChange as (_: boolean) => void} disabled={disabled} className={className} style={style} />;
    }
});
