import React from "react";

export interface Props {
    children: React.ReactElement[] | string[];
    className?: string;
    styles?: React.CSSProperties;
    speed?: number; // number of pixels scrolled per second
}

export interface State {
    hasShadowChildren: boolean;
    paused: boolean;
}

export class VerticalMarquee extends React.PureComponent<Props, State> {
    static displayName = "VerticalMarquee";

    private readonly marqueeRef: React.RefObject<HTMLDivElement> = React.createRef();
    private startTime = 0;
    private monitorFPS = 60; // assume 60Hz initially
    private frame = 0;
    private distScrolledThisSec = 0;

    constructor(props: Props) {
        super(props);

        this.state = {
            hasShadowChildren: false,
            paused: false,
        };
    }

    componentDidMount() {
        window.requestAnimationFrame(this.scroll);
    }

    scroll = (timestamp: number) => {
        const {speed = 30} = this.props;
        const marquee = this.marqueeRef.current;
        if (marquee && marquee.scrollHeight > marquee.clientHeight) {
            this.setState({hasShadowChildren: true});

            // update frame
            this.frame++;

            // reset frame and re-calculate fps per second
            if (this.frame > this.monitorFPS) {
                this.frame = 0;
                this.distScrolledThisSec = 0;
                this.monitorFPS = 1000 / (timestamp - this.startTime);
            }

            const distToBeScrolled = Math.ceil((speed / this.monitorFPS) * this.frame - this.distScrolledThisSec);

            if (distToBeScrolled > 0) {
                if (!this.state.paused) {
                    if (marquee.scrollTop < marquee.scrollHeight / 2) {
                        marquee.scrollTo(0, marquee.scrollTop + distToBeScrolled);
                    } else {
                        marquee.scroll(0, 0);
                    }
                }

                this.distScrolledThisSec += distToBeScrolled;
            }
            this.startTime = timestamp;
        }
        window.requestAnimationFrame(this.scroll);
    };

    enableScrolling = () => this.setState({paused: false});

    disableScrolling = () => this.setState({paused: true});

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
                onMouseEnter={this.disableScrolling}
                onMouseLeave={this.enableScrolling}
            >
                {children}
                {this.state.hasShadowChildren && children}
            </div>
        );
    }
}
