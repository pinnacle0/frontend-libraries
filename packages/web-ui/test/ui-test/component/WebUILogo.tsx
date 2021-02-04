import React from "react";
import {Link} from "@pinnacle0/web-ui/core/Link";
import type {Expandable} from "@pinnacle0/web-ui/admin/AdminApp";

interface Props extends Expandable {}

const logoStyle: React.CSSProperties = {height: "60%"};
const titleStyle: React.CSSProperties = {
    fontSize: "18px",
    fontWeight: "bold",
    color: "#fff",
    marginLeft: 10,
};
const getLogoContainerStyle: (expanded: boolean) => React.CSSProperties = expanded => ({
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    height: expanded ? "80px" : "50px",
    background: "#202c3a",
});

export const WebUILogo: React.FC<Props> = ({expanded}) => {
    return (
        <Link to="/">
            <div style={getLogoContainerStyle(expanded)}>
                <img style={logoStyle} src={require("../asset/logo.png")} />
                {expanded && <h1 style={titleStyle}>Pinnacle UI</h1>}
            </div>
        </Link>
    );
};
