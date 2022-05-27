import type {CardProps} from "antd/lib/card";
import AntCard from "antd/lib/card";
import React from "react";
import "antd/lib/card/style";

export interface Props extends CardProps {}

export class Card extends React.PureComponent<Props> {
    static displayName = "Card";

    static Grid: typeof AntCard.Grid = AntCard.Grid;

    render() {
        return <AntCard {...this.props} />;
    }
}
