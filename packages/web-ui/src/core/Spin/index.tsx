import React from "react";
import AntSpin from "antd/es/spin";
import LoadingOutlined from "@ant-design/icons/LoadingOutlined";
import type {SpinProps as AntSpinProps} from "antd/es/spin";
import {ReactUtil} from "../../util/ReactUtil";

export interface Props extends Omit<AntSpinProps, "spinning"> {
    spinning: boolean;
}

export const Spin = ReactUtil.memo("Spin", ({spinning, children, indicator, ...restProps}: Props) => {
    return (
        <AntSpin spinning={spinning} indicator={indicator || <LoadingOutlined />} {...restProps}>
            {children}
        </AntSpin>
    );
});
