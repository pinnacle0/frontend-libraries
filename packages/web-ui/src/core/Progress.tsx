import type {ProgressProps} from "antd/es/progress";
import AntProgress from "antd/es/progress";
import React from "react";
import "antd/es/progress/style";

interface Props extends ProgressProps {}

export class Progress extends React.PureComponent<Props> {
    static displayName = "Progress";

    render() {
        return <AntProgress {...this.props} />;
    }
}
