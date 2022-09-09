import React from "react";
import {classNames} from "../../util/ClassNames";
import {Tooltip} from "../Tooltip";
import {FormValidationContext} from "./context";
import type {SafeReactChild} from "../../internal/type";

export type FormValidator = () => string | null | Promise<string | null>;

export interface Props {
    children: SafeReactChild;
    label?: SafeReactChild;
    required?: boolean;
    extra?: SafeReactChild;
    validator?: FormValidator;
    className?: string;
    labelStyle?: React.CSSProperties;
    widthMode?: "fill" | "auto" | "shrink"; // No affect for <Form layout="inline">
}

interface State {
    errorMessage: string | null;
}

export class Item extends React.PureComponent<Props, State> {
    static displayName = "Form.Item";
    static contextType = FormValidationContext;
    declare context: React.ContextType<typeof FormValidationContext>;

    private readonly overlayStyle: React.CSSProperties = {color: "red"};

    constructor(props: Props) {
        super(props);
        this.state = {errorMessage: null};
    }

    componentDidMount() {
        this.context.registerValidator(this.validate);
    }

    componentWillUnmount() {
        this.context.unregisterValidator(this.validate);
    }

    validate = async (): Promise<boolean> => {
        const {validator} = this.props;
        if (validator) {
            const errorMessage = await validator();
            this.setState({errorMessage});
            return errorMessage === null;
        } else {
            return true;
        }
    };

    render() {
        const {label, children, className, required, extra, labelStyle, widthMode} = this.props;
        const {errorMessage} = this.state;
        const errorDisplayMode = this.context.errorDisplayMode();

        const childrenNode = typeof children === "number" || typeof children === "string" ? <span className="pure-text">{children}</span> : children;
        const extraMessageNode = extra && <div className="message">{extra}</div>;

        return (
            <div className={classNames("g-form-item", className)}>
                <div className={classNames("g-form-item-label", {required})} style={labelStyle}>
                    {label && <label>{label}</label>}
                </div>
                <div className={classNames("g-form-item-children", {"has-error": errorMessage}, widthMode ? `width-${widthMode}` : "")}>
                    {errorDisplayMode.type === "extra" ? (
                        <React.Fragment>
                            {childrenNode}
                            {extraMessageNode}
                            {errorMessage && <div className="message error">{errorMessage}</div>}
                        </React.Fragment>
                    ) : (
                        <React.Fragment>
                            <Tooltip title={errorMessage} open={errorMessage !== null} placement={errorDisplayMode.placement || "right"} color="white" overlayInnerStyle={this.overlayStyle}>
                                {childrenNode}
                            </Tooltip>
                            {extraMessageNode}
                        </React.Fragment>
                    )}
                </div>
            </div>
        );
    }
}
