import React from "react";
import {Tooltip} from "../Tooltip";
import type {SafeReactChildren} from "../../internal/type";
import "./index.less";

interface Props {
    text: SafeReactChildren;
    maxWidth: number;
    className?: string;
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

    componentDidUpdate(prevProps: Props) {
        if (this.props.text !== prevProps.text) {
            this.updateTextOverflow();
        }
    }

    componentDidMount() {
        this.updateTextOverflow();
    }

    updateTextOverflow = () => {
        const {current} = this.textRef;
        this.setState({overflow: (current && current.clientWidth > this.props.maxWidth) || false});
    };

    render() {
        const {text, style, maxWidth, className = ""} = this.props;

        return (
            <div className={`g-overflowable-text ${className}`}>
                {this.state.overflow ? (
                    <Tooltip overlay={text}>
                        <div className="wrap-text" style={{...style, width: maxWidth}}>
                            {text}
                        </div>
                    </Tooltip>
                ) : (
                    <div style={{display: "inline-block", ...style}}>{text}</div>
                )}
                <div ref={this.textRef} className="shadow-text">
                    {text}
                </div>
            </div>
        );
    }
}
