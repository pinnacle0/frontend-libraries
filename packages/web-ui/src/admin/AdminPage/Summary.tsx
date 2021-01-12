import React from "react";
import type {SafeReactChildren} from "../../internal/type";

export interface Props {
    children: SafeReactChildren;
}

export class Summary extends React.PureComponent<Props> {
    // eslint-disable-next-line @pinnacle0/react-component-display-name -- inner static component
    static displayName = "AdminPage.Summary";

    render() {
        const {children} = this.props;
        return <div className="g-admin-page-summary">{children}</div>;
    }
}
