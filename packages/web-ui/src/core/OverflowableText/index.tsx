import React from "react";
import {Tooltip} from "../Tooltip";
import "./index.less";

interface Props {
    text: React.ReactNode;
    width: number | React.CSSProperties;
    className?: string;
}

export class OverflowableText extends React.PureComponent<Props> {
    static displayName = "OverflowableText";

    render() {
        const {text, width, className = ""} = this.props;

        return (
            <Tooltip className={`g-overflowable-text ${className}`} overlay={text}>
                <div className="wrap-text" style={typeof width === "number" ? {width} : width}>
                    {text}
                </div>
            </Tooltip>
        );
    }
}
