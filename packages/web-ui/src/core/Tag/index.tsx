import React from "react";
import type {TagProps} from "antd/es/tag";
import AntTag from "antd/es/tag";
import type {PresetColorType, PresetStatusColorType} from "antd/es/_util/colors";
import {ReactUtil} from "../../util/ReactUtil";

export type TagColor = PresetColorType | PresetStatusColorType;
export interface Props extends TagProps {}

export const Tag = ReactUtil.memo("Tag", ({variant = "outlined", ...props}: Props) => {
    return <AntTag variant={variant} {...props} />;
});
