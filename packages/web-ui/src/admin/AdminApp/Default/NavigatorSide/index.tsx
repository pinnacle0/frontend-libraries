import React from "react";
import UserOutlined from "@ant-design/icons/UserOutlined";
import {Button} from "../../../../core/Button";
import {Drawer} from "../../../../core/Drawer";
import {i18n} from "../../../../internal/i18n/admin";
import "./index.less";

type DrawerUserInfo = {[title: string]: React.ReactElement | string | null};

interface Props {
    onLogout: () => void;
    drawerInfo: DrawerUserInfo;
}

interface State {
    showDrawer: boolean;
}

export class NavigatorSide extends React.PureComponent<Props, State> {
    static displayName = "NavigatorSide";

    constructor(props: Props) {
        super(props);
        this.state = {
            showDrawer: false,
        };
    }

    showDrawer = () => this.setState({showDrawer: true});

    closeDrawer = () => this.setState({showDrawer: false});

    render() {
        const t = i18n();
        const {onLogout, drawerInfo} = this.props;
        const {showDrawer} = this.state;

        return (
            <React.Fragment>
                <Button type="primary" id="admin-app-default-navigator-side-button" size="small" onClick={this.showDrawer}>
                    <UserOutlined />
                </Button>
                <Drawer width={350} open={showDrawer} closable={false} onClose={this.closeDrawer}>
                    <div id="admin-app-default-drawer">
                        <UserOutlined className="avatar" />
                        <div className="grid">
                            {Object.entries(drawerInfo).map(([title, node], index) => {
                                if (node) {
                                    return (
                                        <div className="row" key={index}>
                                            <b className="label">{title}</b>
                                            {node}
                                        </div>
                                    );
                                }
                            })}
                        </div>
                        <div className="bottom">
                            <Button type="primary" size="large" onClick={onLogout}>
                                {t.logout}
                            </Button>
                        </div>
                    </div>
                </Drawer>
            </React.Fragment>
        );
    }
}
