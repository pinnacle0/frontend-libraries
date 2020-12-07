import React from "react";
import "./index.less";

interface Props {
    children: React.ReactElement[];
}

interface State {
    current: number; // Range: [-1, children.length], 1st & last are cloned
}

export class Carousel3D extends React.PureComponent<Props, State> {
    static displayName = "Carousel3D";

    private readonly autoPlayInterval = 3000;
    private isTimerComplete: boolean = false; // onCarouselTransitionEnd each frame is executed only once.
    private isChildTransition: boolean = true; // whether transition is necessary or not.
    private timer: number | undefined;

    constructor(props: Props) {
        super(props);
        this.state = {
            current: 0,
        };
    }

    componentDidMount() {
        this.startAnimation();
    }

    componentDidUpdate() {
        if (this.state.current === React.Children.count(this.props.children)) {
            this.isChildTransition = false;
        } else {
            this.isChildTransition = true;
        }
        this.isTimerComplete = false;
    }

    componentWillUnmount() {
        clearTimeout(this.timer);
    }

    jumpToPrevSlide = () => {
        clearTimeout(this.timer);
        this.setState(prev => ({current: prev.current === 0 ? React.Children.count(this.props.children) - 1 : prev.current - 1}));
        this.isTimerComplete = true;
    };

    jumpToNextSlide = () => {
        clearTimeout(this.timer);
        this.setState(prev => ({current: prev.current === React.Children.count(this.props.children) ? 0 : prev.current + 1}));
        this.isTimerComplete = true;
    };

    jumpToSlide = (index: number) => {
        clearTimeout(this.timer);
        this.setState({current: index});
        this.isTimerComplete = true;
    };

    startAnimation = () => {
        if (!this.isTimerComplete) {
            this.isTimerComplete = true;
            if (this.state.current === React.Children.count(this.props.children)) {
                this.setState({current: 0});
            } else {
                this.timer = window.setTimeout(() => this.setState({current: this.state.current + 1}), this.autoPlayInterval);
            }
        }
    };

    handleMouseEnter = () => {
        clearTimeout(this.timer!);
        this.isTimerComplete = true;
    };

    handleMouseLeave = () => {
        clearTimeout(this.timer!);
        this.isTimerComplete = false;
        this.startAnimation();
    };

    render() {
        const {children} = this.props;
        const {current} = this.state;
        const childrenLength = React.Children.count(children);
        if (childrenLength <= 1) {
            return (
                <div className="g-carousel-3d">
                    <div className="child-slide active">{children}</div>
                </div>
            );
        } else {
            return (
                <div className={`g-carousel-3d ${this.isChildTransition ? "has-transition" : ""}`} onTransitionEnd={this.startAnimation}>
                    <div className={`child-slide child-clone ${current === -1 ? "pre" : ""}`}>{children[childrenLength - 2]}</div>
                    <div className={`child-slide child-clone ${current === -1 ? "active" : ""} ${current === 0 ? "pre" : ""} `}>{children[childrenLength - 1]}</div>
                    {React.Children.map(children, (child, key) => (
                        <div
                            key={key}
                            className={`child-slide ${current === key - 1 ? "next" : current === key ? "active" : current === key + 1 ? "pre" : ""}`}
                            onMouseEnter={() => current === key && this.handleMouseEnter()}
                            onMouseLeave={() => current === key && this.handleMouseLeave()}
                        >
                            {child}
                            <div className="arrow arrow-left" onClick={this.jumpToPrevSlide}>
                                <svg width="40px" height="44px" viewBox="0 0 40 44" version="1.1">
                                    <g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd" opacity="0.300000012">
                                        <g transform="translate(-80.000000, -133.000000)" fill="#000000">
                                            <g transform="translate(80.000000, 133.000000)">
                                                <path d="M38,-1.42108547e-14 C39.1045695,-1.44137608e-14 40,0.8954305 40,2 L40,41.1428571 C40,42.2474266 39.1045695,43.1428571 38,43.1428571 L2,43.1428571 C0.8954305,43.1428571 1.3527075e-16,42.2474266 0,41.1428571 L0,2 C-1.3527075e-16,0.8954305 0.8954305,-1.40079486e-14 2,-1.42108547e-14 L38,-1.42108547e-14 Z M22.2974465,7.582202 L11.3775647,19.7056672 C10.5306088,20.6475229 10.5306088,22.1746071 11.3775647,23.1145987 L22.2974465,35.2376129 C23.146744,36.1794687 24.5218276,36.1794687 25.3693131,35.2376129 C26.2181367,34.2971102 26.2181367,32.7703567 25.3693131,31.8282905 L15.984835,21.4100879 L25.3693131,10.9930879 C26.2181088,10.0512322 26.2181088,8.52441857 25.3693131,7.58208173 C24.5219391,6.64203 23.1469112,6.64203 22.2974465,7.582202 Z" />
                                            </g>
                                        </g>
                                    </g>
                                </svg>
                            </div>
                            <div className="arrow arrow-right" onClick={this.jumpToNextSlide}>
                                <svg width="40px" height="44px" viewBox="0 0 40 44" version="1.1">
                                    <g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd" opacity="0.300000012">
                                        <g transform="translate(-1240.000000, -133.000000)" fill="#000000">
                                            <g transform="translate(1240.000000, 133.000000)">
                                                <path
                                                    d="M38,-1.42108547e-14 C39.1045695,-1.44137608e-14 40,0.8954305 40,2 L40,41.1428571 C40,42.2474266 39.1045695,43.1428571 38,43.1428571 L2,43.1428571 C0.8954305,43.1428571 1.3527075e-16,42.2474266 0,41.1428571 L0,2 C-1.3527075e-16,0.8954305 0.8954305,-1.40079486e-14 2,-1.42108547e-14 L38,-1.42108547e-14 Z M22.2974465,7.582202 L11.3775647,19.7056672 C10.5306088,20.6475229 10.5306088,22.1746071 11.3775647,23.1145987 L22.2974465,35.2376129 C23.146744,36.1794687 24.5218276,36.1794687 25.3693131,35.2376129 C26.2181367,34.2971102 26.2181367,32.7703567 25.3693131,31.8282905 L15.984835,21.4100879 L25.3693131,10.9930879 C26.2181088,10.0512322 26.2181088,8.52441857 25.3693131,7.58208173 C24.5219391,6.64203 23.1469112,6.64203 22.2974465,7.582202 Z"
                                                    transform="translate(20.000000, 21.571429) scale(-1, 1) translate(-20.000000, -21.571429) "
                                                />
                                            </g>
                                        </g>
                                    </g>
                                </svg>
                            </div>
                        </div>
                    ))}
                    <div className={`child-slide child-clone ${current === childrenLength ? "active" : ""} ${current === childrenLength - 1 ? "next" : ""}`}>{children[0]}</div>
                    <div className={`child-slide child-clone ${current === childrenLength ? "next" : ""}`}>{children[1]}</div>
                    <div className="pagination">
                        {React.Children.map(children, (_, key) => (
                            <div
                                key={key}
                                className={current % childrenLength === key ? "active" : ""}
                                onClick={() => this.jumpToSlide(key)}
                                onMouseEnter={() => current === key && this.handleMouseEnter()}
                            />
                        ))}
                    </div>
                </div>
            );
        }
    }
}
