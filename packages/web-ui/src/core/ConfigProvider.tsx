import React from "react";
import {ReactUtil} from "../util/ReactUtil";
import AntdConfigProvider, {type ConfigProviderProps} from "antd/es/config-provider";
import type {ThemeConfig} from "antd";

export type Theme = ThemeConfig;

export interface Props extends ConfigProviderProps {}

export const ConfigProvider = ReactUtil.memo("ConfigProvider", (props: Props) => {
    return <AntdConfigProvider {...props} />;
});
