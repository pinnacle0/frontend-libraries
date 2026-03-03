import React from "react";
import {Button} from "../../core/Button";
import {Link} from "../../core/Link";
import {i18n} from "../../internal/i18n/admin";

interface Props {
    type: "success" | "error";
    title: string;
    subtitle?: string;
    hideButton?: boolean;
    secondaryButton?: {label: string; onClick: () => void};
}

const iconStyle: React.CSSProperties = {fontSize: 72, display: "block", textAlign: "center", marginBottom: 24};

export class Result extends React.PureComponent<Props> {
    static displayName = "AdminPage.Result";

    private readonly buttonContainerStyle: React.CSSProperties = {display: "flex", width: 300, justifyContent: "space-around", margin: "0 auto"};

    renderExtra = () => {
        const {secondaryButton, hideButton} = this.props;
        const t = i18n();
        return (
            !hideButton && (
                <div style={this.buttonContainerStyle}>
                    <Link to="/">
                        <Button type="primary">{t.goHome}</Button>
                    </Link>
                    {secondaryButton && <Button onClick={secondaryButton.onClick}>{secondaryButton.label}</Button>}
                </div>
            )
        );
    };

    render() {
        const {type, title, subtitle} = this.props;
        return (
            <div style={{padding: "48px 32px", textAlign: "center"}}>
                <div style={iconStyle}>{type === "success" ? <span style={{color: "#52c41a"}}>✓</span> : <span style={{color: "#ff4d4f"}}>✕</span>}</div>
                <h1 style={{fontSize: 24, fontWeight: 600, marginBottom: 8}}>{title}</h1>
                {subtitle && <p style={{fontSize: 14, color: "rgba(0,0,0,0.45)", marginBottom: 24}}>{subtitle}</p>}
                {this.renderExtra()}
            </div>
        );
    }
}
