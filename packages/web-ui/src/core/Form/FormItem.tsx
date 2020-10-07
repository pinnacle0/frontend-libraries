import React from "react";
import {FormValidationContext} from "./context";
import {SafeReactChild} from "../../internal/type";
import {Tooltip} from "../Tooltip";

export type FormValidator = () => string | null | Promise<string | null>;

export interface Props {
    children: SafeReactChild;
    label?: string;
    required?: boolean;
    extra?: SafeReactChild;
    validator?: FormValidator;
    className?: string;
    labelStyle?: React.CSSProperties;
}

interface State {
    errorMessage: string | null;
}

export class FormItem extends React.PureComponent<Props, State> {
    static displayName = "FormItem";
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
        const {label, children, className, required, extra, labelStyle} = this.props;
        const {errorMessage} = this.state;
        const errorDisplayMode = this.context.errorDisplayMode();
        return (
            <div className={`g-form-item ${className || ""}`}>
                <div className={`g-form-item-label ${required ? "required" : ""}`} style={labelStyle}>
                    {label && <label title={label}>{label}</label>}
                </div>
                <div className={`g-form-item-children ${errorMessage ? "has-error" : ""}`}>
                    {errorDisplayMode.type === "extra" ? (
                        <React.Fragment>
                            {children}
                            {extra && <div className="message">{extra}</div>}
                            {errorMessage && <div className="message error">{errorMessage}</div>}
                        </React.Fragment>
                    ) : (
                        <React.Fragment>
                            <Tooltip title={errorMessage} visible={errorMessage !== null} placement={errorDisplayMode.placement || "right"} color="white" overlayInnerStyle={this.overlayStyle}>
                                {children as React.ReactElement}
                            </Tooltip>
                            {extra && <div className="message">{extra}</div>}
                        </React.Fragment>
                    )}
                </div>
            </div>
        );
    }
}
