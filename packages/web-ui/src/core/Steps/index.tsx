import type {StepsProps} from "antd/es/steps";
import AntSteps from "antd/es/steps";
import React from "react";
import {ReactUtil} from "../../util/ReactUtil";

export interface Props extends StepsProps {}

export type StepItem = NonNullable<StepsProps["items"]>[number];

export const Steps = ReactUtil.memo("Steps", (props: Props) => {
    return <AntSteps {...props} />;
});
