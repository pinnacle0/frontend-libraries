import React from "react";
import {ReactUtil} from "../../util/ReactUtil";
import type {Locale} from "../../util/LocaleUtil";
import {useDidMountEffect} from "../../hooks/useDidMountEffect";
import {LocaleContext, LocaleUtil} from "../../util/LocaleUtil";
import "../../css/global.less";

export interface Props {
    children: React.ReactNode;
    locale: Locale | "auto";
}

export const UIProvider = ReactUtil.memo("UIProvider", ({locale, children}: Props) => {
    useDidMountEffect(() => LocaleUtil.setInitial(locale));
    const currentLocale = LocaleUtil.current();
    return <LocaleContext.Provider value={currentLocale}>{children}</LocaleContext.Provider>;
});
