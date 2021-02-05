import React from "react";
import {AdminApp} from "@pinnacle0/web-ui/admin/AdminApp/index";
import type {Expandable} from "@pinnacle0/web-ui/admin/AdminApp/index";
import {dummyEmptyCallback} from "../util/dummyCallback";

interface Props extends Expandable {}

const userInfo = {
    "Your Name": "Dion",
    "Your Role": "Developer",
    "Last Login": "This Morning",
};

export const WebUINavigatorSide: React.FC<Props> = ({expanded: _}) => {
    return <AdminApp.NavigatorSide userInfo={userInfo} onLogout={dummyEmptyCallback} />;
};
