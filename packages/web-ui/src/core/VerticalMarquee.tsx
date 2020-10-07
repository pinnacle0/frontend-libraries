import React from "react";

export interface Props {
    children: React.ReactElement[] | string[];
    className?: string;
    styles?: React.CSSProperties;
    speed?: "slow" | "default" | "fast";
}

export interface State {
    hasShadowChildren: boolean;
}

export class VerticalMarquee extends React.PureComponent<Props, State> {
    static displayName = "VerticalMarquee";

    private readonly marqueeRef: React.RefObject<HTMLDivElement> = React.createRef();
    private interval: number | undefined;

    constructor(props: Props) {
        super(props);

        this.state = {
            hasShadowChildren: false,
        };
    }

    componentDidMount() {
        this.createScrollInterval();
    }

    createScrollInterval = () => {
        const {speed = "default"} = this.props;
        const marquee = this.marqueeRef.current;
        if (marquee && marquee.scrollHeight > marquee.clientHeight) {
            this.setState({hasShadowChildren: true});

            this.interval = window.setInterval(
                () => {
                    if (marquee.scrollTop < marquee.scrollHeight / 2) {
                        // to fix marquee stop infinitely scrolling when browser zoom out
                        // worked as browser's zoom ratio is lager than 33%
                        marquee.scrollTo(0, marquee.scrollTop + 2);
                    } else {
                        marquee.scroll(0, 0);
                    }
                },
                speed === "default" ? 30 : speed === "slow" ? 50 : 15
            );
        }
    };

    clearInterval = () => window.clearInterval(this.interval);

    render() {
        const {className, children, styles} = this.props;
        return (
            <div
                style={{
                    height: "100%",
                    overflow: "hidden",
                    ...styles,
                }}
                ref={this.marqueeRef}
                className={className}
                onMouseEnter={this.clearInterval}
                onMouseLeave={this.createScrollInterval}
            >
                {children}
                {this.state.hasShadowChildren && children}
            </div>
        );
    }
}
