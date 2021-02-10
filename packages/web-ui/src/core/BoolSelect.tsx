import React from "react";
import {EnumSelect} from "./EnumSelect";
import type {ControlledFormValue, PickOptional} from "../internal/type";
import {i18n} from "../internal/i18n/core";

export interface Props<AllowNull extends boolean> extends ControlledFormValue<AllowNull extends false ? boolean : boolean | null> {
    allowNull: AllowNull;
    trueText?: string;
    falseText?: string;
    trueOptionFirst?: boolean;
    disabled?: boolean;
    className?: string;
    style?: React.CSSProperties;
}

export class BoolSelect<AllowNull extends boolean> extends React.PureComponent<Props<AllowNull>> {
    static displayName = "BoolSelect";
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
        const {trueOptionFirst, allowNull, value, onChange, disabled, className, style} = this.props;
        const list = trueOptionFirst ? this.trueOptionFirstList : this.falseOptionFirstList;

        if (allowNull) {
            return (
                <EnumSelect.Nullable
                    list={list}
                    translator={this.translator}
                    value={value as boolean | null}
                    onChange={onChange as (_: boolean | null) => void}
                    disabled={disabled}
                    className={className}
                    style={style}
                />
            );
        } else {
            return <EnumSelect list={list} translator={this.translator} value={value as boolean} onChange={onChange as (_: boolean) => void} disabled={disabled} className={className} style={style} />;
        }
    }
}
