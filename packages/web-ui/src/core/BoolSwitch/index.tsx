import AntSwitch from "antd/es/switch";
import React from "react";
import type {ControlledFormValue} from "../../internal/type";
import {i18n} from "../../internal/i18n/core";
import {ReactUtil} from "../../util/ReactUtil";

export interface Props extends ControlledFormValue<boolean> {
    trueText?: string;
    falseText?: string;
    disabled?: boolean;
    style?: React.CSSProperties;
    loading?: boolean;
}

const YesNo = ReactUtil.memo("YesNo", (props: Omit<Props, "trueText" | "falseText">) => {
    const t = i18n();
    return <BoolSwitch trueText={t.yes} falseText={t.no} {...props} />;
});

const OnOff = ReactUtil.memo("OnOff", (props: Omit<Props, "trueText" | "falseText">) => {
    const t = i18n();
    return <BoolSwitch trueText={t.on} falseText={t.off} {...props} />;
});

const ActiveOrNot = ReactUtil.memo("ActiveOrNot", (props: Omit<Props, "trueText" | "falseText">) => {
    const t = i18n();
    return <BoolSwitch trueText={t.active} falseText={t.inactive} {...props} />;
});

export const BoolSwitch = ReactUtil.compound("BoolSwitch", {YesNo, OnOff, ActiveOrNot}, ({trueText, falseText, disabled, loading, style, value, onChange}: Props) => {
    return <AntSwitch loading={loading} style={style} checked={value} onChange={onChange} disabled={disabled} checkedChildren={trueText} unCheckedChildren={falseText} />;
});
