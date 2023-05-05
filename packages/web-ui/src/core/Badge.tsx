import React from "react";
import type {BadgeProps as AntBadgeProps} from "antd/es/badge";
import AntBadge from "antd/es/badge";
import {ReactUtil} from "../util/ReactUtil";

export interface Props extends AntBadgeProps {}

export const Badge = ReactUtil.memo("Badge", (props: Props) => {
    return <AntBadge {...props} />;
});
