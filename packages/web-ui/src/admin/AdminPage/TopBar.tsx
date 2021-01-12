import React from "react";
import type {SafeReactChildren} from "../../internal/type";

export interface Props {
    children: SafeReactChildren;
}

export class TopBar extends React.PureComponent<Props> {
    // eslint-disable-next-line @pinnacle0/react-component-display-name -- inner static component
    static displayName = "AdminPage.TopBar";

    render() {
        const {children} = this.props;
        return <div className="g-admin-page-top-bar">{children}</div>;
    }
}
