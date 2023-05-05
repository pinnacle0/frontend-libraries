import React from "react";
import {ReactUtil} from "../util/ReactUtil";
import {ConfigProvider} from "antd";
import {StyleProvider as StyleProviderBase, legacyLogicalPropertiesTransformer} from "@ant-design/cssinjs";
import type {ThemeConfig} from "antd";

interface Props {
    children: React.ReactNode;
    theme?: ThemeConfig;
}

export const StyleProvider = ReactUtil.memo("StyleProvider", ({children, theme}: Props) => {
    return (
        <StyleProviderBase hashPriority="high" transformers={[legacyLogicalPropertiesTransformer]}>
            <ConfigProvider theme={theme}>{children}</ConfigProvider>
        </StyleProviderBase>
    );
});
