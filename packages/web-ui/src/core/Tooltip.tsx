import AntTooltip, {TooltipPlacement, TooltipProps} from "antd/lib/tooltip";
import "antd/lib/tooltip/style";
import React from "react";

// Cannot use interface extends here because TooltipProps is a type union
export type Props = TooltipProps;

export class Tooltip extends React.PureComponent<Props> {
    static displayName = "Tooltip";

    render() {
        return <AntTooltip {...this.props} />;
    }
}

export type {TooltipPlacement};
