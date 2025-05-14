import React from "react";
import AntdDrawer from "antd/es/drawer";
import type {DrawerProps, PushState} from "antd/es/drawer";

export interface Props extends DrawerProps {}

export class Drawer extends React.PureComponent<Props> {
    render() {
        return <AntdDrawer {...this.props} />;
    }
}

export type {PushState};
