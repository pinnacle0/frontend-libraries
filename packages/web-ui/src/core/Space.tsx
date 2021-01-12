import React from "react";
import type {SpaceProps} from "antd/lib/space";
import AntSpace from "antd/lib/space";
import "antd/lib/space/style";

interface Props extends SpaceProps {}

export class Space extends React.PureComponent<Props> {
    static displayName = "Space";

    render() {
        return <AntSpace {...this.props} />;
    }
}
