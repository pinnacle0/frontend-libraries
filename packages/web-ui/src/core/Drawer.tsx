import React from "react";
import AntdDrawer from "antd/lib/drawer";
import type {DrawerProps, PushState} from "antd/lib/drawer";
import "antd/lib/drawer/style";

export interface Props extends DrawerProps {}

export class Drawer extends React.PureComponent<Props> {
    render() {
        return <AntdDrawer {...this.props} />;
    }
}
export type {PushState};
