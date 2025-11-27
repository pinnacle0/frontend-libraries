import React from "react";
import AntdCollapse from "antd/es/collapse";
import type {CollapseProps} from "antd/es/collapse";
import {ReactUtil} from "../../util/ReactUtil";

export interface Props extends CollapseProps {}
export type CollapseItemsProps = CollapseProps["items"];

export const Collapse = ReactUtil.memo("Collapse", ({...props}: Props) => {
    return <AntdCollapse {...props} />;
});
