import React from "react";
import AntBadge from "antd/es/badge";
import type {BadgeProps as AntBadgeProps} from "antd/es/badge";

export interface Props extends AntBadgeProps {}

export class Badge extends React.PureComponent<Props> {
    static displayName = "Badge";

    render() {
        return <AntBadge {...this.props} />;
    }
}
