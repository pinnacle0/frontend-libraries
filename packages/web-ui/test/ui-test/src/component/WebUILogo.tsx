import React from "react";
import {AdminApp} from "@pinnacle0/web-ui/admin/AdminApp";
import type {ExpandableProps} from "@pinnacle0/web-ui/admin/AdminApp/Default/SquareLogo";

export const WebUILogo: React.FC<ExpandableProps> = ({expanded}) => {
    return <AdminApp.SquareLogo src={require("../asset/logo.png")} expanded={expanded} />;
};
