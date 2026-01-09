import React from "react";
import chineseLocale from "antd/es/locale/zh_CN";
import englishLocale from "antd/es/locale/en_US";
import {ReactUtil} from "../../util/ReactUtil";
import {StyleProvider, legacyLogicalPropertiesTransformer} from "@ant-design/cssinjs";
import {ConfigProvider} from "antd";
import type {Locale} from "../../util/LocaleUtil";
import type {ConfigProviderProps} from "antd/es/config-provider";
import {useDidMountEffect} from "../../hooks/useDidMountEffect";
import {LocaleContext, LocaleUtil} from "../../util/LocaleUtil";

export type {ThemeConfig} from "antd";

export interface Props extends Omit<ConfigProviderProps, "locale"> {
    children: React.ReactNode;
    locale: Locale | "auto";
}

export const UIProvider = ReactUtil.memo("UIProvider", ({locale, children, ...restProps}: Props) => {
    useDidMountEffect(() => LocaleUtil.setInitial(locale));
    const currentLocale = LocaleUtil.current();
    return (
        <StyleProvider hashPriority="high" transformers={[legacyLogicalPropertiesTransformer]}>
            <ConfigProvider locale={currentLocale === "zh" ? chineseLocale : englishLocale} {...restProps}>
                <LocaleContext.Provider value={currentLocale}>{children}</LocaleContext.Provider>
            </ConfigProvider>
        </StyleProvider>
    );
});
