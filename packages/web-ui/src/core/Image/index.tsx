import type {ImageProps} from "antd/es/image";
import AntImage from "antd/es/image";
import React from "react";
import {ReactUtil} from "../../util/ReactUtil";

export interface Props extends ImageProps {}

export const Image = ReactUtil.compound(
    "Image",
    {
        PreviewGroup: AntImage.PreviewGroup,
    },
    (props: Props) => {
        return <AntImage {...props} />;
    }
);
