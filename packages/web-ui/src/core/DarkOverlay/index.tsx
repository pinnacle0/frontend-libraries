import React from "react";
import ReactDOM from "react-dom";
import type {SafeReactChildren} from "../../internal/type";
import "./index.less";

export interface Props {
    children: SafeReactChildren;
    className?: string;
}

export class DarkOverlay extends React.PureComponent<Props> {
    static displayName = "DarkOverlay";

    render() {
        const {children, className} = this.props;
        return ReactDOM.createPortal(<div className={`g-dark-overlay ${className || ""}`}>{children}</div>, document.body);
    }
}
