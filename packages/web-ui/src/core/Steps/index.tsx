import type {StepsProps} from "antd/es/steps";
import AntSteps from "antd/es/steps";
import React from "react";

export interface Props extends StepsProps {}

export type StepItem = NonNullable<StepsProps["items"]>[number];

export class Steps extends React.PureComponent<Props> {
    static displayName = "Steps";

    render() {
        return <AntSteps {...this.props} />;
    }
}
