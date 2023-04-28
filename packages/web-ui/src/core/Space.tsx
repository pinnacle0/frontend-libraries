import React from "react";
import type {SpaceProps} from "antd/es/space";
import AntSpace from "antd/es/space";

interface Props extends SpaceProps {}

export class Space extends React.PureComponent<Props> {
    static displayName = "Space";

    render() {
        return <AntSpace {...this.props} />;
    }
}
