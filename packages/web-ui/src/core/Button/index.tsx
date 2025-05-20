import React from "react";
import AntButton from "antd/es/button";
import type {ButtonProps} from "antd/es/button";
import classNames from "classnames";

export interface Props extends ButtonProps {
    loading?: boolean;
}

export function Button({className, loading, style, ...rest}: Props) {
    return <AntButton className={classNames("g-button", className)} style={{gap: 0, ...style}} loading={loading && {icon: <React.Fragment />}} {...rest} />;
}

export type {ButtonSize, ButtonShape, ButtonType, ButtonHTMLType} from "antd/es/button";
