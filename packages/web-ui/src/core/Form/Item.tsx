import React from "react";
import type {SafeReactChild} from "../../internal/type";
import {Tooltip} from "../Tooltip";
import {FormValidationContext} from "./context";

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

        const childrenNode = <span className="g-form-item-children-inputs">{children}</span>;
        const extraMessageNode = extra && <div className="message">{extra}</div>;

        return (
            <div className={`g-form-item ${className || ""}`}>
                <div className={`g-form-item-label ${required ? "required" : ""}`} style={labelStyle}>
                    {label && <label>{label}</label>}
                </div>
                <div className={`g-form-item-children ${errorMessage ? "has-error" : ""} ${widthMode ? `width-${widthMode}` : ""}`}>
                    {errorDisplayMode.type === "extra" ? (
                        <React.Fragment>
                            {childrenNode}
                            {extraMessageNode}
                            {errorMessage && <div className="message error">{errorMessage}</div>}
                        </React.Fragment>
                    ) : (
                        <React.Fragment>
                            <Tooltip title={errorMessage} visible={errorMessage !== null} placement={errorDisplayMode.placement || "right"} color="white" overlayInnerStyle={this.overlayStyle}>
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
