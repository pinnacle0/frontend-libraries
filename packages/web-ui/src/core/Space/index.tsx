import React from "react";
import type {SpaceProps} from "antd/es/space";
import AntSpace from "antd/es/space";
import {ReactUtil} from "../../util/ReactUtil";

interface Props extends SpaceProps {}

export const Space = ReactUtil.compound("Space", {Compact: AntSpace.Compact}, (props: Props) => {
    return <AntSpace {...props} />;
});
