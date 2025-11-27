import React from "react";
import ReactDOM from "react-dom";
import {ReactUtil} from "../../util/ReactUtil";
import "./index.less";

export interface Props {
    children: React.ReactNode;
    className?: string;
    style?: React.CSSProperties;
    onClick?: () => void;
}

export const DarkOverlay = ReactUtil.memo("DarkOverlay", ({children, className, style, onClick}: Props) => {
    return ReactDOM.createPortal(
        <div className={`g-dark-overlay ${className || ""}`} style={style} onClick={e => e.target === e.currentTarget && onClick?.()}>
            {children}
        </div>,
        document.body
    );
});
