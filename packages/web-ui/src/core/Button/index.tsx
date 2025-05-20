import React from "react";
import AntButton from "antd/es/button";
import type {ButtonProps} from "antd/es/button";
import classNames from "classnames";
import "./index.less";

export interface Props extends ButtonProps {
    loading?: boolean;
}

export function Button({className, loading, style, ...rest}: Props) {
    return <AntButton className={classNames("g-button", className)} loading={loading} {...rest} />;
}

export type {ButtonSize, ButtonShape, ButtonType, ButtonHTMLType} from "antd/es/button";
