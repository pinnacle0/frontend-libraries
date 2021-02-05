import React from "react";
import {Button} from "../../../core/Button";
import UserOutlined from "@ant-design/icons/UserOutlined";
import AntDrawer from "antd/lib/drawer";
import {i18n} from "../../../internal/i18n/admin";
import {LocaleSelect} from "../../../core/LocaleSelect";
import {AdminApp} from "../index";
import "./index.less";

type DrawerUserInfo = {[title: string]: React.ReactElement | string | null};

interface Props {
    onLogout: () => void;
    userInfo: DrawerUserInfo;
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
        const {onLogout, userInfo} = this.props;
        const {showDrawer} = this.state;
        const completedDrawerInfo: DrawerUserInfo = {
            ...userInfo,
            [t.notificationSound]: <AdminApp.SoundSwitch />,
            [t.language]: <LocaleSelect />,
        };

        return (
            <React.Fragment>
                <Button id="drawer-button" color="wire-frame" onClick={this.showDrawer}>
                    <UserOutlined />
                </Button>
                <AntDrawer width={350} visible={showDrawer} closable={false} onClose={this.closeDrawer}>
                    <div id="admin-app-drawer">
                        <UserOutlined className="avatar" />
                        <div className="grid">
                            {Object.entries(completedDrawerInfo).map(([title, node], index) => {
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
                            <Button size="large" onClick={onLogout}>
                                {t.logout}
                            </Button>
                        </div>
                    </div>
                </AntDrawer>
            </React.Fragment>
        );
    }
}
