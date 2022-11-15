import React from "react";
import ReactDOM from "react-dom";
import "./index.less";

export interface Props {
    children: React.ReactNode;
    className?: string;
    style?: React.CSSProperties;
}

export class DarkOverlay extends React.PureComponent<Props> {
    static displayName = "DarkOverlay";

    render() {
        const {children, className, style} = this.props;
        return ReactDOM.createPortal(
            <div className={`g-dark-overlay ${className || ""}`} style={style}>
                {children}
            </div>,
            document.body
        );
    }
}
