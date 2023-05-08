import React from "react";
import {ReactUtil} from "../util/ReactUtil";
import ConfigProvider from "antd/es/config-provider";
import {StyleProvider as StyleProviderBase, legacyLogicalPropertiesTransformer} from "@ant-design/cssinjs";
import type {ThemeConfig} from "antd";

export type Theme = ThemeConfig;

export interface Props {
    children: React.ReactNode;
    theme?: Theme;
}

export const StyleProvider = ReactUtil.memo("StyleProvider", ({children, theme}: Props) => {
    return (
        <StyleProviderBase hashPriority="high" transformers={[legacyLogicalPropertiesTransformer]}>
            <ConfigProvider theme={theme}>{children}</ConfigProvider>
        </StyleProviderBase>
    );
});
