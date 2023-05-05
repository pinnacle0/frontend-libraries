import type {StepsProps} from "antd/es/steps";
import AntSteps from "antd/es/steps";
import React from "react";

export interface Props extends StepsProps {}

export class Steps extends React.PureComponent<Props> {
    static displayName = "Steps";

    static Step: typeof AntSteps.Step = AntSteps.Step;

    render() {
        return <AntSteps {...this.props} />;
    }
}
