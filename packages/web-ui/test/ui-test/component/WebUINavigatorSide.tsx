import React from "react";
import {AdminApp} from "@pinnacle0/web-ui/admin/AdminApp";
import {dummyEmptyCallback} from "../util/dummyCallback";

interface Props {}

const userInfo = {
    "Your Name": "Dion",
    "Your Role": "Developer",
    "Last Login": "This Morning",
};

export const WebUINavigatorSide: React.FC<Props> = () => {
    return <AdminApp.Default.NavigatorSide userInfo={userInfo} onLogout={dummyEmptyCallback} />;
};
