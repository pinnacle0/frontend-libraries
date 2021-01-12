import AntSwitch from "antd/lib/switch";
import React from "react";
import type {ControlledFormValue} from "../internal/type";
import {i18n} from "../internal/i18n/core";
import "antd/lib/switch/style";

export interface Props extends ControlledFormValue<boolean> {
    trueText: string;
    falseText: string;
    disabled?: boolean;
    style?: React.CSSProperties;
    loading?: boolean;
}

export class BoolSwitch extends React.PureComponent<Props> {
    static displayName = "BoolSwitch";

    static YesNo = (props: Omit<Props, "trueText" | "falseText">) => {
        const t = i18n();
        return <BoolSwitch trueText={t.yes} falseText={t.no} {...props} />;
    };

    static OnOff = (props: Omit<Props, "trueText" | "falseText">) => {
        const t = i18n();
        return <BoolSwitch trueText={t.on} falseText={t.off} {...props} />;
    };

    static ActiveOrNot = (props: Omit<Props, "trueText" | "falseText">) => {
        const t = i18n();
        return <BoolSwitch trueText={t.active} falseText={t.inactive} {...props} />;
    };

    render() {
        const {trueText, falseText, disabled, loading, style, value, onChange} = this.props;
        return <AntSwitch loading={loading} style={style} checked={value} onChange={onChange} disabled={disabled} checkedChildren={trueText} unCheckedChildren={falseText} />;
    }
}
