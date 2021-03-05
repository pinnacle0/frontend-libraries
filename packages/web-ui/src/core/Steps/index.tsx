import type {StepsProps} from "antd/lib/steps";
import AntSteps from "antd/lib/steps";
import React from "react";
import "antd/lib/steps/style";
import "./index.less";

export interface Props extends StepsProps {}

export class Steps extends React.PureComponent<Props> {
    static displayName = "Steps";

    static Step = AntSteps.Step;

    render() {
        return <AntSteps {...this.props} />;
    }
}
