import React from "react";
import type {SpaceProps} from "antd/es/space";
import AntSpace from "antd/es/space";

export interface Props extends SpaceProps {}

export class Space extends React.PureComponent<Props> {
    static displayName = "Space";

    static Compact = AntSpace.Compact;

    render() {
        return <AntSpace {...this.props} />;
    }
}
