import React from "react";
import {BrowserRouter} from "react-router-dom";
import {AdminApp} from "@pinnacle0/web-ui/admin/AdminApp";
import {NavigationService} from "../util/NavigationService";
import {LocaleProvider} from "@pinnacle0/web-ui/core/LocaleProvider";
import {dummyEmptyCallback} from "../util/dummyCallback";
import "@pinnacle0/web-ui/css/global.less";

require("moment/locale/zh-cn");

const navigationService = new NavigationService();
const badges = {
    "/admin/table-page": 30,
    "/admin/result-page": 9,
};
const userInfo = {
    "Your Name": "Dion",
    "Your Role": "Developer",
    "Last Login": "This Morning",
};

export const Main = () => (
    <LocaleProvider locale="auto">
        <BrowserRouter>
            <AdminApp
                logo={require("../asset/logo.png")}
                name="Pinnacle UI"
                navigationService={navigationService}
                onLogout={dummyEmptyCallback}
                badges={badges}
                drawerUserInfo={userInfo}
                supportMultiLanguage
            />
        </BrowserRouter>
    </LocaleProvider>
);
