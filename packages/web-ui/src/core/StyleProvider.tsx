import React from "react";
import {ReactUtil} from "../util/ReactUtil";
import {StyleProvider as StyleProviderBase, legacyLogicalPropertiesTransformer} from "@ant-design/cssinjs";

export interface Props {
    children: React.ReactNode;
}

export const StyleProvider = ReactUtil.memo("StyleProvider", ({children}: Props) => {
    return (
        <StyleProviderBase hashPriority="high" transformers={[legacyLogicalPropertiesTransformer]}>
            {children}
        </StyleProviderBase>
    );
});
