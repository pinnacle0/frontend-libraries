import React from "react";
import {AdminApp} from "@pinnacle0/web-ui/admin/AdminApp";
import {dummyEmptyCallback} from "../util/dummyCallback";
import {SoundSwitch} from "@pinnacle0/web-ui/admin/AdminApp/Default/SoundSwitch";
import {LocaleSelect} from "@pinnacle0/web-ui/core/LocaleSelect";
import {i18n} from "@pinnacle0/web-ui/internal/i18n/admin";

interface Props {}

export const WebUINavigatorSide: React.FC<Props> = () => {
    const t = i18n();
    const drawerInfo = {
        "Your Name": "Dion",
        "Your Role": "Developer",
        "Last Login": "This Morning",
        [t.notificationSound]: <SoundSwitch />,
        [t.language]: <LocaleSelect />,
    };
    return <AdminApp.Default.NavigatorSide drawerInfo={drawerInfo} onLogout={dummyEmptyCallback} />;
};
