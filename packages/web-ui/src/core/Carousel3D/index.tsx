import React from "react";
import "./index.less";

interface Props {
    children: React.ReactElement[];
}

interface State {
    currentActiveIndex: number; // Range: [-1, children.length], 1st & last are cloned
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
            currentActiveIndex: 0,
        };
    }

    componentDidMount() {
        this.startAnimation();
    }

    componentDidUpdate() {
        if (this.state.currentActiveIndex === React.Children.count(this.props.children)) {
            this.isChildTransition = false;
        } else {
            this.isChildTransition = true;
        }
        this.isTimerComplete = false;
    }

    componentWillUnmount() {
        clearTimeout(this.timer);
    }

    jumpToSlide = (index: number) => {
        clearTimeout(this.timer);
        this.isTimerComplete = true;
        this.setState({currentActiveIndex: index});
    };

    startAnimation = () => {
        if (!this.isTimerComplete) {
            this.isTimerComplete = true;
            if (this.state.currentActiveIndex === React.Children.count(this.props.children)) {
                this.setState({currentActiveIndex: 0});
            } else {
                this.timer = window.setTimeout(() => this.setState({currentActiveIndex: this.state.currentActiveIndex + 1}), this.autoPlayInterval);
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
        const {currentActiveIndex} = this.state;
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
                    <div className={`child-slide child-clone ${currentActiveIndex === -1 ? "pre" : ""}`}>{children[childrenLength - 2]}</div>
                    <div className={`child-slide child-clone ${currentActiveIndex === -1 ? "active" : ""} ${currentActiveIndex === 0 ? "pre" : ""} `}>{children[childrenLength - 1]}</div>
                    {React.Children.map(children, (child, key) => (
                        <div
                            className={`child-slide ${currentActiveIndex === key - 1 ? "next" : currentActiveIndex === key ? "active" : currentActiveIndex === key + 1 ? "pre" : ""}`}
                            key={key}
                            onMouseEnter={() => {
                                if (currentActiveIndex === key) {
                                    this.handleMouseEnter();
                                }
                            }}
                            onMouseLeave={() => {
                                if (currentActiveIndex === key) {
                                    this.handleMouseLeave();
                                }
                            }}
                        >
                            {child}
                            <div className="arrow arrow-left" onClick={() => this.jumpToSlide(currentActiveIndex - 1 === -1 ? children.length - 1 : currentActiveIndex - 1)}>
                                &#x3c;
                            </div>
                            <div className="arrow arrow-right" onClick={() => this.jumpToSlide(currentActiveIndex + 1 === children.length ? 0 : currentActiveIndex + 1)}>
                                &#x3e;
                            </div>
                        </div>
                    ))}
                    <div className={`child-slide child-clone ${currentActiveIndex === childrenLength ? "active" : ""} ${currentActiveIndex === childrenLength - 1 ? "next" : ""}`}>{children[0]}</div>
                    <div className={`child-slide child-clone ${currentActiveIndex === childrenLength ? "next" : ""}`}>{children[1]}</div>
                    <div className="pagination">
                        {React.Children.map(children, (child, key) => (
                            <div
                                className={currentActiveIndex % childrenLength === key ? "active" : ""}
                                key={key}
                                onClick={() => this.jumpToSlide(key)}
                                onMouseEnter={() => {
                                    if (currentActiveIndex === key) {
                                        this.handleMouseEnter();
                                    }
                                }}
                            />
                        ))}
                    </div>
                </div>
            );
        }
    }
}
