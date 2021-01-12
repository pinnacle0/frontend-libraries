import AntConfigProvider from "antd/lib/config-provider";
import chineseLocale from "antd/lib/locale/zh_CN";
import englishLocale from "antd/lib/locale/en_US";
import React from "react";
import type {SafeReactChildren} from "../internal/type";
import type {Locale} from "../util/LocaleUtil";
import {LocaleContext, LocaleUtil} from "../util/LocaleUtil";

export interface Props {
    locale: Locale | "auto";
    children: SafeReactChildren;
}

export class LocaleProvider extends React.PureComponent<Props> {
    static displayName = "LocaleProvider";

    constructor(props: Props) {
        super(props);
        LocaleUtil.setInitial(props.locale);
    }

    render() {
        const {children} = this.props;
        const locale = LocaleUtil.current();
        return (
            <LocaleContext.Provider value={locale}>
                <AntConfigProvider locale={locale === "zh" ? chineseLocale : englishLocale}>{children}</AntConfigProvider>
            </LocaleContext.Provider>
        );
    }
}
