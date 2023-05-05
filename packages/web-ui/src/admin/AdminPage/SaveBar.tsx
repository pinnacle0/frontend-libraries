import React from "react";
import {Button} from "../../core/Button";
import {i18n} from "../../internal/i18n/admin";

export interface Props {
    onSave: () => void;
    onReset?: () => void;
    leftNode?: React.ReactElement;
}

export class SaveBar extends React.PureComponent<Props> {
    static displayName = "AdminPage.SaveBar";

    render() {
        const {leftNode, onReset, onSave} = this.props;
        const t = i18n();
        return (
            <div className="g-admin-page-save-bar">
                <div className="left">{leftNode}</div>
                <div className="right">
                    {onReset && (
                        <Button size="large" onClick={onReset}>
                            {t.reset}
                        </Button>
                    )}
                    <Button type="primary" size="large" onClick={onSave}>
                        {t.save}
                    </Button>
                </div>
            </div>
        );
    }
}
