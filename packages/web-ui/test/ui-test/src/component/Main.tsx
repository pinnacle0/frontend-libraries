import React from "react";
import {AdminApp} from "@pinnacle0/web-ui/admin/AdminApp";
import {NavigationData, TestFeaturePermission} from "../util/NavigationData";
import {WebUINavigatorSide} from "./WebUINavigatorSide";
import {WebUILogo} from "./WebUILogo";
import {UIProvider} from "@pinnacle0/web-ui/core/UIProvider";
import {ModalUtil} from "@pinnacle0/web-ui/util/ModalUtil";
import {MessageUtil} from "@pinnacle0/web-ui/util/MessageUtil";

const badges = {
    "/core/button": 4000,
    "/admin/table-page": [30, 10],
    "/admin/result-page": 9,
};

function globalErrorHandler(error: unknown) {
    console.error(`global error handler:`, error);
}

export const Main = () => (
    <UIProvider locale="auto">
        <AdminApp
            name="Pinnacle UI"
            NavigatorSideComponent={WebUINavigatorSide}
            LogoComponent={WebUILogo}
            navigationGroups={NavigationData}
            permissions={[TestFeaturePermission.ROOT_PERMISSION]}
            superAdminPermission={TestFeaturePermission.ROOT_PERMISSION}
            badges={badges}
            onLifecycleError={globalErrorHandler}
        />
        <ModalUtil.Root />
        <MessageUtil.Root />
    </UIProvider>
);
