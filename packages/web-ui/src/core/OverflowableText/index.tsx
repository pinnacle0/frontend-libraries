import React from "react";
import {classNames} from "../../util/ClassNames";
import {Tooltip} from "../Tooltip";
import "./index.less";

interface Props {
    children: React.ReactNode;
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
        if (this.props.children !== prevProps.children) {
            this.updateTextOverflow();
        }
    }

    componentDidMount() {
        this.updateTextOverflow();
    }

    updateTextOverflow = () => {
        const {current} = this.textRef;
        this.setState({overflow: (current && current.scrollWidth > this.props.maxWidth) || false});
    };

    render() {
        const {children, style, maxWidth, className} = this.props;

        return (
            <div className={classNames("g-overflowable-text", className)}>
                {this.state.overflow ? (
                    <Tooltip overlay={children}>
                        <div className="wrap-text" style={{...style, width: maxWidth}}>
                            {children}
                        </div>
                    </Tooltip>
                ) : (
                    <div style={{display: "inline-block", ...style}}>{children}</div>
                )}
                <div ref={this.textRef} style={{maxWidth}} className="shadow-text">
                    {children}
                </div>
            </div>
        );
    }
}
