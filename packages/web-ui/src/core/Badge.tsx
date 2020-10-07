import AntBadge, {BadgeProps as AntBadgeProps} from "antd/lib/badge";
import React from "react";
import "antd/lib/badge/style";

export interface Props extends AntBadgeProps {}

export class Badge extends React.PureComponent<Props> {
    static displayName = "Badge";

    render() {
        return <AntBadge {...this.props} />;
    }
}
