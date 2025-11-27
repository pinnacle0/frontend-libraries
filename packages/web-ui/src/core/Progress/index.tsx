import type {ProgressProps} from "antd/es/progress";
import AntProgress from "antd/es/progress";
import React from "react";
import {ReactUtil} from "../../util/ReactUtil";

interface Props extends ProgressProps {}

export const Progress = ReactUtil.memo("Progress", ({...props}: Props) => {
    return <AntProgress {...props} />;
});
