import AntTooltip, {TooltipProps, TooltipPlacement} from "antd/lib/tooltip";
import React from "react";
import "antd/lib/tooltip/style";

// Cannot use interface extends here because TooltipProps is a type union
export type Props = TooltipProps;

export class Tooltip extends React.PureComponent<Props> {
    static displayName = "Tooltip";

    render() {
        return <AntTooltip {...this.props} />;
    }
}

export {TooltipPlacement};
