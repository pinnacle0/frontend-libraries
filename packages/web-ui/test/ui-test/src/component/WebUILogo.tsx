import React from "react";
import {AdminApp} from "@pinnacle0/web-ui/admin/AdminApp";
import type {ExpandableProps} from "@pinnacle0/web-ui/admin/AdminApp/Default/SquareLogo";
import Logo from "../asset/logo.png";

export const WebUILogo: React.FC<ExpandableProps> = ({expanded}) => {
    return <AdminApp.SquareLogo src={Logo} expanded={expanded} />;
};
