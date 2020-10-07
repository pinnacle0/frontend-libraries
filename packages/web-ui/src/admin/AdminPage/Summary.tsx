import React from "react";
import {SafeReactChildren} from "../../internal/type";

export interface Props {
    children: SafeReactChildren;
}

export class Summary extends React.PureComponent<Props> {
    static displayName = "Summary";

    render() {
        const {children} = this.props;
        return <div className="g-admin-page-summary">{children}</div>;
    }
}
