import React from "react";
import {Button} from "../../core/Button";
import {i18n} from "../../internal/i18n/admin";

export interface Props {
    onSave: () => void;
    onReset?: () => void;
    leftNode?: React.ReactElement;
}

export class SaveBar extends React.PureComponent<Props> {
    // eslint-disable-next-line @pinnacle0/react-component-display-name -- inner static component
    static displayName = "AdminPage.SaveBar";

    private readonly containerStyle: React.CSSProperties = {marginTop: 10, display: "flex", justifyContent: "space-between", alignItems: "center"};
    private readonly resetButtonStyle: React.CSSProperties = {marginRight: 20};

    render() {
        const {leftNode, onReset, onSave} = this.props;
        const t = i18n();
        return (
            <div style={this.containerStyle}>
                <div>{leftNode}</div>
                <div>
                    {onReset && (
                        <Button size="large" color="wire-frame" style={this.resetButtonStyle} onClick={onReset}>
                            {t.reset}
                        </Button>
                    )}
                    <Button size="large" onClick={onSave}>
                        {t.save}
                    </Button>
                </div>
            </div>
        );
    }
}
