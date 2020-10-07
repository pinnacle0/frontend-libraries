import React from "react";

interface Props {
    digit: string;
}

interface State {
    currentDigit: string;
    withSlidedClass: boolean;
}

export class SlidingDigit extends React.PureComponent<Props, State> {
    static displayName = "SlidingDigit";

    constructor(props: Props) {
        super(props);
        this.state = {
            currentDigit: this.props.digit,
            withSlidedClass: false,
        };
    }

    componentDidUpdate() {
        if (this.state.currentDigit !== this.props.digit) {
            this.setState({withSlidedClass: true});
        }
    }

    render() {
        return (
            <div className="sliding-digit-outer">
                <div onTransitionEnd={() => this.setState({currentDigit: this.props.digit, withSlidedClass: false})} className={`sliding-digit-inner ${this.state.withSlidedClass ? "slided" : ""}`}>
                    <p>{this.props.digit}</p>
                    <p>{this.state.currentDigit}</p>
                </div>
            </div>
        );
    }
}
