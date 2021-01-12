import React from "react";
import type {TooltipPlacement} from "./Tooltip";
import {Tooltip} from "./Tooltip";
import type {SafeReactChildren} from "../internal/type";

interface Props {
    /**
     * If there are multiple children, they should handle inline display by self.
     */
    children?: SafeReactChildren;
    /**
     * If falsy, tooltip icon will hide.
     */
    explanation?: SafeReactChildren;
    placement?: TooltipPlacement;
}

export class WithExplanation extends React.PureComponent<Props> {
    static displayName = "WithExplanation";

    private readonly tooltipQuestionContainerStyle: React.CSSProperties = {
        display: "inline-flex",
        justifyContent: "center",
        alignItems: "center",
        verticalAlign: "middle",
    };
    private readonly tooltipOverlayStyle: React.CSSProperties = {maxWidth: 500};
    private readonly tooltipQuestionStyle: React.CSSProperties = {
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        width: 14,
        height: 14,
        borderRadius: "50%",
        border: "1px solid currentColor",
        fontSize: 10,
        marginLeft: 5,
    };

    render() {
        const {children, explanation} = this.props;
        if (explanation) {
            return (
                <div className="g-with-explanation" style={this.tooltipQuestionContainerStyle}>
                    {children}
                    <Tooltip title={Array.isArray(explanation) ? explanation.map((_, index) => <p key={index}>{_}</p>) : explanation} overlayStyle={this.tooltipOverlayStyle}>
                        <div style={this.tooltipQuestionStyle}>?</div>
                    </Tooltip>
                </div>
            );
        } else {
            return children || "";
        }
    }
}
