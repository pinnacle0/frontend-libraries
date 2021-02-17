import React from "react";
import {AdminApp} from "@pinnacle0/web-ui/admin/AdminApp";
import {NavigationService} from "../util/NavigationService";
import {LocaleProvider} from "@pinnacle0/web-ui/core/LocaleProvider";
import {WebUILogo} from "./WebUILogo";
import {WebUINavigatorSide} from "./WebUINavigatorSide";
import "@pinnacle0/web-ui/css/global.less";

require("moment/locale/zh-cn");

const navigationService = new NavigationService();
const badges = {
    "/core/button": 4000,
    "/admin/table-page": 30,
    "/admin/result-page": 9,
};

function globalErrorHandler(error: unknown) {
    console.error(`global error handler:`, error);
}

export const Main = () => (
    <LocaleProvider locale="auto">
        <AdminApp
            name="Pinnacle UI"
            NavigatorSideComponent={WebUINavigatorSide}
            LogoComponent={WebUILogo}
            navigationService={navigationService}
            badges={badges}
            onLifecycleError={globalErrorHandler}
        />
    </LocaleProvider>
);
