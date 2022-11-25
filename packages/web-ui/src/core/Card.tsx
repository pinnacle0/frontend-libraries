import type {CardProps} from "antd/es/card";
import AntCard from "antd/es/card";
import React from "react";
import "antd/es/card/style";

export interface Props extends CardProps {}

export class Card extends React.PureComponent<Props> {
    static displayName = "Card";

    static Grid: typeof AntCard.Grid = AntCard.Grid;

    render() {
        return <AntCard {...this.props} />;
    }
}
