import React from "react";

export interface Props {
    children: React.ReactNode;
}

export class Summary extends React.PureComponent<Props> {
    static displayName = "AdminPage.Summary";

    render() {
        const {children} = this.props;
        return <div className="g-admin-page-summary">{children}</div>;
    }
}
