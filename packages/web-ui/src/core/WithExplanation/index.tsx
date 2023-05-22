import React from "react";
import {classNames} from "../../util/ClassNames";
import {Tooltip} from "../Tooltip";
import type {PickOptional} from "../../internal/type";
import type {TooltipPlacement} from "../Tooltip";
import "./index.less";

export interface Props {
    /**
     * If there are multiple children, they should handle inline display by self.
     */
    children?: React.ReactNode;
    /**
     * If falsy, tooltip icon will hide.
     */
    explanation?: React.ReactNode;
    placement?: TooltipPlacement;
    iconPosition?: "left" | "right";
}

export class WithExplanation extends React.PureComponent<Props> {
    static displayName = "WithExplanation";

    static defaultProps: PickOptional<Props> = {
        iconPosition: "right",
    };

    render() {
        const {children, explanation, iconPosition} = this.props;
        if (explanation) {
            return (
                <div className={classNames("g-with-explanation", `with-icon-${iconPosition}`)}>
                    {children}
                    <Tooltip className="g-with-explanation-tooltip" title={Array.isArray(explanation) ? explanation.map((_, index) => <p key={index}>{_}</p>) : explanation}>
                        <div className="icon-container">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 26 24">
                                <circle cx="8" cy="8" r="8" data-name="椭圆形" style={{strokeMiterlimit: 10}} transform="translate(3.5 4)" />
                                <path
                                    d="M2.338 9.9a.972.972 0 0 1-.294-.715.929.929 0 0 1 .294-.714.991.991 0 0 1 .728-.28 1 1 0 0 1 .742.28.929.929 0 0 1 .294.714.994.994 0 0 1-.308.728 1.049 1.049 0 0 1-.728.28 1 1 0 0 1-.728-.293zm-.014-2.466V7.2a2.794 2.794 0 0 1 .28-1.33 6.938 6.938 0 0 1 1.582-1.74l.239-.266a1.638 1.638 0 0 0 .391-1.022 1.593 1.593 0 0 0-.406-1.148 1.624 1.624 0 0 0-1.19-.419 1.549 1.549 0 0 0-1.373.6A2.345 2.345 0 0 0 1.47 3.3H0A3.247 3.247 0 0 1 .882.9 3.245 3.245 0 0 1 3.318 0 3.131 3.131 0 0 1 5.5.742a2.53 2.53 0 0 1 .841 2 2.71 2.71 0 0 1-.531 1.71 14.388 14.388 0 0 1-1.176 1.092 2.319 2.319 0 0 0-.588.728 1.871 1.871 0 0 0-.224.924v.238z"
                                    transform="translate(8.336 6.808)"
                                />
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
