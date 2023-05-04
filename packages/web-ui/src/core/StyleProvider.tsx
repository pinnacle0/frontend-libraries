import React from "react";
import {ReactUtil} from "../util/ReactUtil";
import {ConfigProvider} from "antd";
import {StyleProvider as StyleProviderBase, legacyLogicalPropertiesTransformer} from "@ant-design/cssinjs";

interface Props {
    children: React.ReactNode;
}

export const StyleProvider = ReactUtil.memo("StyleProvider", ({children}: Props) => {
    return (
        <StyleProviderBase hashPriority="high" transformers={[legacyLogicalPropertiesTransformer]}>
            <ConfigProvider
                theme={{
                    token: {borderRadius: 5},
                }}
            >
                {children}
            </ConfigProvider>
        </StyleProviderBase>
    );
});
