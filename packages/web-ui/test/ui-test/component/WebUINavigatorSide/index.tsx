import React from "react";
import {Button} from "@pinnacle0/web-ui/core/Button";
import UserOutlined from "@ant-design/icons/UserOutlined";
import AntDrawer from "antd/lib/drawer";
import {i18n} from "../../../../src/internal/i18n/admin";
import {dummyEmptyCallback} from "../../util/dummyCallback";
import {LocaleSelect} from "@pinnacle0/web-ui/core/LocaleSelect";
import {AdminApp} from "@pinnacle0/web-ui/admin/AdminApp";
import type {Expandable} from "@pinnacle0/web-ui/admin/AdminApp";
import "./index.less";

interface Props {}

type DrawerUserInfo = {[title: string]: React.ReactElement | string | null};

const userInfo = {
    "Your Name": "Dion",
    "Your Role": "Developer",
    "Last Login": "This Morning",
};

export const WebUINavigatorSide: React.FC<Props> = () => {
    const [showDrawer, setShowDrawer] = React.useState(false);

    const t = i18n();
    const completedDrawerInfo: DrawerUserInfo = {
        ...userInfo,
        [t.notificationSound]: <AdminApp.SoundSwitch />,
        [t.language]: <LocaleSelect />,
    };

    return (
        <React.Fragment>
            <Button id="drawer-button" color="wire-frame" onClick={() => setShowDrawer(true)}>
                <UserOutlined />
            </Button>
            <AntDrawer width={350} visible={showDrawer} closable={false} onClose={() => setShowDrawer(false)}>
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
                        <Button size="large" onClick={dummyEmptyCallback}>
                            {t.logout}
                        </Button>
                    </div>
                </div>
            </AntDrawer>
        </React.Fragment>
    );
};
