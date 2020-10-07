import AntSpin from "antd/lib/spin";
import "antd/lib/spin/style";
import LoadingOutlined from "@ant-design/icons/LoadingOutlined";
import React from "react";

interface Props {
    spinning: boolean;
    indicator?: React.ReactElement;
    size?: "small" | "default" | "large";
}

export class Spin extends React.PureComponent<Props> {
    static displayName = "Spin";

    render() {
        const {spinning, children, indicator, size} = this.props;
        return (
            <AntSpin size={size} spinning={spinning} indicator={indicator || <LoadingOutlined />}>
                {children}
            </AntSpin>
        );
    }
}
