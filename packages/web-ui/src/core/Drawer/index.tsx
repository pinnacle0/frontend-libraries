import React from "react";
import AntdDrawer from "antd/es/drawer";
import type {DrawerProps, PushState} from "antd/es/drawer";
import {ReactUtil} from "../../util/ReactUtil";

export interface Props extends DrawerProps {}
export type {PushState};

export const Drawer = ReactUtil.memo("Drawer", ({...props}: Props) => {
    return <AntdDrawer {...props} />;
});
