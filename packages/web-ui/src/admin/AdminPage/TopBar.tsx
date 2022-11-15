import React from "react";

export interface Props {
    children: React.ReactNode;
}

export class TopBar extends React.PureComponent<Props> {
    static displayName = "AdminPage.TopBar";

    render() {
        const {children} = this.props;
        return <div className="g-admin-page-top-bar">{children}</div>;
    }
}
