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

            /**
             * Caveat: Browser requires minimum of 1px to be scrolled, and it does not accept decimal number.
             * When zoomed, the requirement will change - e.g. when zoomed 90%, the required pixel to be zoomed will be 1/0.9 = 1.11px.
             * This means a minimum of Math.ceil(1.11) = 2px to be scrolled.
             * Ref: https://css-tricks.com/can-javascript-detect-the-browsers-zoom-level/
             * Ref: https://www.geeksforgeeks.org/how-to-detect-page-zoom-level-in-all-modern-browsers-using-javascript/
             * Note: there is a known bug, so the following does not work on FireFox. Ref: https://bugzilla.mozilla.org/show_bug.cgi?id=435275
             */
            const zoomRatio = window.outerWidth / window.innerWidth;
            const minScrollPixel = Math.ceil(1 / zoomRatio);
            let distToBeScrolled = Math.ceil((speed / this.monitorFPS) * this.frame - this.distScrolledThisSec);
            distToBeScrolled = distToBeScrolled >= minScrollPixel ? distToBeScrolled : 0; // make sure the dist scrolled is larger than minimum required pixels

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
