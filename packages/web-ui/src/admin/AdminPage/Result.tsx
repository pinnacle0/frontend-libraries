import React from "react";
import AntResult from "antd/es/result";
import {Button} from "../../core/Button";
import {i18n} from "../../internal/i18n/admin";

interface Props {
    type: "success" | "error";
    title: string;
    subtitle?: string;
    hideButton?: boolean;
    secondaryButton?: {label: string; onClick: () => void};
}

export class Result extends React.PureComponent<Props> {
    static displayName = "AdminPage.Result";

    private readonly buttonContainerStyle: React.CSSProperties = {display: "flex", width: 300, justifyContent: "space-around", margin: "0 auto"};

    renderExtra = () => {
        const {secondaryButton, hideButton} = this.props;
        const t = i18n();
        return (
            !hideButton && (
                <div style={this.buttonContainerStyle}>
                    <Button link="/">{t.goHome}</Button>
                    {secondaryButton && (
                        <Button color="wire-frame" onClick={secondaryButton.onClick}>
                            {secondaryButton.label}
                        </Button>
                    )}
                </div>
            )
        );
    };

    render() {
        const {type, title, subtitle} = this.props;
        return <AntResult title={title} subTitle={subtitle} status={type} extra={this.renderExtra()} />;
    }
}
