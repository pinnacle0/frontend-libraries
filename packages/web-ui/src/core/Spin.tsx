import React from "react";
import AntSpin from "antd/lib/spin";
import LoadingOutlined from "@ant-design/icons/LoadingOutlined";
import type {SpinProps as AntSpinProps, SpinSize as AntSpinSize, SpinIndicator as AntSpinIndicator} from "antd/lib/spin";
import "antd/lib/spin/style";

export interface Props extends Omit<AntSpinProps, "spinning"> {
    spinning: boolean;
}

export class Spin extends React.PureComponent<Props> {
    static displayName = "Spin";

    render() {
        const {spinning, children, indicator, ...restProps} = this.props;
        return (
            <AntSpin spinning={spinning} indicator={indicator || <LoadingOutlined />} {...restProps}>
                {children}
            </AntSpin>
        );
    }
}

export type SpinSize = AntSpinSize;
export type SpinIndicator = AntSpinIndicator;
