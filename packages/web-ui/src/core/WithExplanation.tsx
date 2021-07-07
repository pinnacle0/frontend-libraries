import React from "react";
import type {SafeReactChildren} from "../internal/type";
import type {TooltipPlacement} from "./Tooltip";
import {Tooltip} from "./Tooltip";

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

    // TODO/Anthony: remove inline style, use CSS file to control (so that project is easy to over-write)
    // TODO/Anthony: set hover cursor as `help`
    private readonly tooltipQuestionContainerStyle: React.CSSProperties = {
        display: "inline-flex",
        justifyContent: "center",
        alignItems: "center",
    };
    private readonly tooltipOverlayStyle: React.CSSProperties = {maxWidth: 500};
    private readonly tooltipQuestionStyle: React.CSSProperties = {
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        width: 14,
        height: 14,
        borderRadius: "50%",
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
                        <div style={this.tooltipQuestionStyle}>
                            <svg viewBox="0 0 1024 1024">
                                <path d="M512 0C229.322105 0 0 229.914947 0 512S229.322105 1024 512 1024 1024 794.085053 1024 512 794.677895 0 512 0z m45.972211 779.964632a65.428211 65.428211 0 0 1-45.972211 18.378105h-1.239579c-17.785263 0-34.330947-6.736842-46.565053-19.024842a65.320421 65.320421 0 0 1-19.024842-46.565053c0-19.024842 6.736842-34.330947 19.617685-46.618947 11.641263-12.234105 27.594105-18.378105 46.618947-18.378106h15.898947v1.832422c12.288 2.425263 23.336421 7.976421 31.258948 16.545684 12.288 12.288 19.024842 27.594105 19.024842 46.618947 0 18.378105-6.736842 34.330947-19.617684 47.21179z m96.309894-283.270737c-4.311579 5.497263-15.36 16.545684-60.092631 55.781052-11.048421 9.162105-19.671579 20.210526-25.168842 31.258948-6.144 11.641263-9.162105 23.929263-9.162106 38.642526v27.594105H454.332632v-27.594105c0-29.426526 4.850526-53.355789 15.306105-72.973474 10.401684-20.857263 36.163368-49.690947 80.949895-88.279579l11.048421-12.288c10.994526-13.473684 15.898947-26.947368 15.898947-40.421052 0-19.671579-5.497263-35.031579-15.898947-46.026105-10.455579-10.401684-26.408421-15.952842-47.21179-15.952843-25.761684 0-44.193684 7.383579-54.595368 22.689685-10.401684 14.120421-15.952842 34.330947-15.952842 61.33221v15.952842H339.698526v-15.952842c0-53.948632 15.952842-98.088421 47.804632-129.994105 31.905684-32.498526 76.692211-49.044211 131.880421-49.044211 48.397474 0 88.279579 13.473684 118.298947 40.421053 31.258947 27.001263 46.618947 64.404211 46.026106 111.023158 0 36.756211-9.808842 68.661895-29.426527 93.776842z" />
                            </svg>
                        </div>
                    </Tooltip>
                </div>
            );
        } else {
            return children || "";
        }
    }
}
