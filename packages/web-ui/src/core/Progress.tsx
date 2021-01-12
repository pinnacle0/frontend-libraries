import type {ProgressProps} from "antd/lib/progress";
import AntProgress from "antd/lib/progress";
import React from "react";
import "antd/lib/progress/style";

interface Props extends ProgressProps {}

export class Progress extends React.PureComponent<Props> {
    static displayName = "Progress";

    render() {
        return <AntProgress {...this.props} />;
    }
}
