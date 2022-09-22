import React from "react";
import Progress from "antd/lib/progress";
import type {ProgressProps} from "antd/lib/progress";
import "antd/lib/progress/style";

interface Props extends ProgressProps {}

export class Popover extends React.PureComponent<Props> {
    static displayName = "Progress";

    render() {
        return <Progress {...this.props} />;
    }
}
