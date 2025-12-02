import React from "react";
import {Tabs} from "./index";
import type {Props as TabsProps} from "./index";
import {ReactUtil} from "../../util/ReactUtil";

export interface Props extends Omit<TabsProps, "activeKey" | "onChange" | "defaultActiveKey"> {
    title: string;
    children: React.ReactNode;
}

export const Single = ReactUtil.memo("Single", ({children, title, ...rest}: Props) => {
    return <Tabs {...rest} items={[{label: title, key: title, children}]} />;
});
