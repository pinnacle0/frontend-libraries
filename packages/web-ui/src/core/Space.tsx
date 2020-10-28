import React from "react";
import AntSpace, {SpaceProps} from "antd/lib/space";
import "antd/lib/space/style";

interface Props extends SpaceProps {}

export class Space extends React.PureComponent<Props> {
    static displayName = "Space";

    render() {
        return <AntSpace {...this.props} />;
    }
}
