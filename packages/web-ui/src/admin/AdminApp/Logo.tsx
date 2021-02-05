import React from "react";
import {Link} from "../../core/Link";
import type {Expandable} from "./index";

export interface Props extends Expandable {
    src: string;
    name: string;
}

export class Logo extends React.PureComponent<Props> {
    static displayName = "Logo";

    private readonly logoContainerStyle: React.CSSProperties = {
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#202c3a",
    };

    private readonly logoStyle: React.CSSProperties = {height: "60%"};

    private readonly titleStyle: React.CSSProperties = {
        fontSize: "18px",
        fontWeight: "bold",
        color: "#fff",
        marginLeft: 10,
    };

    render() {
        const {expanded, src, name} = this.props;
        return (
            <Link to="/">
                <div style={{...this.logoContainerStyle, height: expanded ? "80px" : "50px"}}>
                    <img style={this.logoStyle} src={src} />
                    {expanded && <h1 style={this.titleStyle}>{name}</h1>}
                </div>
            </Link>
        );
    }
}
