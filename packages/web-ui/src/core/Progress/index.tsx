import React from "react";
import Progress from "antd/es/progress";
import type {ProgressProps} from "antd/es/progress";
import "antd/es/progress/style";

interface Props extends ProgressProps {}

export class Popover extends React.PureComponent<Props> {
    static displayName = "Progress";

    render() {
        return <Progress {...this.props} />;
    }
}
