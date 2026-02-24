import React from "react";
import AntButton from "antd/es/button";
import type {ButtonProps} from "antd/es/button";
import classNames from "classnames";
import {ReactUtil} from "../../util/ReactUtil";
import "./index.less";

export type {ButtonSize, ButtonShape, ButtonType, ButtonHTMLType} from "antd/es/button";
export interface Props extends ButtonProps {
    loading?: boolean;
}

export const Button = ReactUtil.memo("Button", ({className, loading, ...rest}: Props) => {
    return <AntButton className={classNames("g-button", className)} loading={loading} {...rest} />;
});
