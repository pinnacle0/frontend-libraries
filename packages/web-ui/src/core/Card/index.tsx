import type {CardProps} from "antd/es/card";
import AntCard from "antd/es/card";
import React from "react";
import {ReactUtil} from "../../util/ReactUtil";

export interface Props extends CardProps {}

export const Card = ReactUtil.compound("Card", {Grid: AntCard.Grid}, (props: Props) => {
    return <AntCard {...props} />;
});
