import React from "react";
import {Tooltip} from "../Tooltip";
import "./index.less";

interface Props {
    text: string;
    className?: string;
    maxWidth: number;
    style?: React.CSSProperties;
}

export class OverflowableText extends React.PureComponent<Props> {
    static displayName = "OverflowableText";

    render() {
        const {text, style, maxWidth, className = ""} = this.props;

        return text.length > maxWidth ? (
            <Tooltip className={`g-overflowable-text ${className}`} overlay={text}>
                <div className="wrap-text" style={{...style, width: maxWidth}}>
                    {text}
                </div>
            </Tooltip>
        ) : (
            text
        );
    }
}
