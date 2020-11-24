import React from "react";
import {Tooltip} from "../Tooltip";
import "./index.less";

interface Props {
    text: React.ReactNode;
    className?: string;
    maxWidth: number;
    style?: React.CSSProperties;
}

interface States {
    overflow: boolean;
}

export class OverflowableText extends React.PureComponent<Props, States> {
    static displayName = "OverflowableText";

    private readonly textRef = React.createRef<HTMLDivElement>();

    constructor(props: Props) {
        super(props);

        this.state = {
            overflow: false,
        };
    }

    componentDidMount() {
        const {current} = this.textRef;
        this.setState({overflow: (current && current.clientWidth > this.props.maxWidth) || false});
    }

    render() {
        const {text, style, maxWidth, className = ""} = this.props;

        return this.state.overflow ? (
            <Tooltip className={`g-overflowable-text ${className}`} overlay={text}>
                <div className="wrap-text" style={{...style, width: maxWidth}}>
                    {text}
                </div>
            </Tooltip>
        ) : (
            <div ref={this.textRef} style={{display: "inline-block", ...style}}>
                {text}
            </div>
        );
    }
}
