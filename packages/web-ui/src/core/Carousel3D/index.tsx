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
                                &#x3c;
                            </div>
                            <div className="arrow arrow-right" onClick={this.jumpToNextSlide}>
                                &#x3e;
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
