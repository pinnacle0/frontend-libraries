import React from "react";
import AntButton from "antd/es/button";
import type {ButtonProps} from "antd/es/button";

export interface Props extends ButtonProps {}

export function Button(props: Props) {
    return <AntButton {...props} />;
}

export type {ButtonSize, ButtonShape, ButtonType, ButtonHTMLType} from "antd/es/button";
