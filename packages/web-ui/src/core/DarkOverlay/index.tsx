import React from "react";
import ReactDOM from "react-dom";
import "./index.less";

export interface Props {
    children: React.ReactNode;
    className?: string;
    style?: React.CSSProperties;
    onClick?: () => void;
}

export class DarkOverlay extends React.PureComponent<Props> {
    static displayName = "DarkOverlay";

    render() {
        const {children, className, style, onClick} = this.props;
        return ReactDOM.createPortal(
            <div className={`g-dark-overlay ${className || ""}`} style={style} onClick={e => e.target === e.currentTarget && onClick?.()}>
                {children}
            </div>,
            document.body
        );
    }
}
