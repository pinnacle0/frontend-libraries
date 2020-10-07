import React from "react";
import {Tooltip} from "./Tooltip";
import {SafeReactChildren} from "../internal/type";

interface Props {
    /**
     * If there are multiple children, they should handle inline display by self.
     */
    children?: SafeReactChildren;
    /**
     * If falsy, tooltip icon will hide.
     */
    explanation?: SafeReactChildren;
}

export class TextWithExplanation extends React.PureComponent<Props> {
    static displayName = "TextWithExplanation";

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
                <div style={this.tooltipQuestionContainerStyle}>
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
