import React from "react";
import {AdminApp} from "@pinnacle0/web-ui/admin/AdminApp";
import type {Expandable} from "@pinnacle0/web-ui/admin/AdminApp";

interface Props extends Expandable {}

export const WebUILogo: React.FC<Props> = ({expanded}) => {
    return <AdminApp.Logo src={require("../asset/logo.png")} name="Pinnacle UI" expanded={expanded} />;
};
