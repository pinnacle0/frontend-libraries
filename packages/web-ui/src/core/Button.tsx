import React from "react";
import AntButton from "antd/es/button";
import type {ButtonProps} from "antd/es/button";
import classNames from "classnames";

export interface Props extends ButtonProps {}

export function Button({className, ...rest}: Props) {
    return <AntButton className={classNames("g-button", className)} {...rest} />;
}

export type {ButtonSize, ButtonShape, ButtonType, ButtonHTMLType} from "antd/es/button";
