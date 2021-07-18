import React from "react";
import {Spin} from "../Spin";
import {Button} from "../Button";
import {FormValidationContext} from "./context";
import {i18n} from "../../internal/i18n/core";
import {Item} from "./Item";
import type {PickOptional, SafeReactChildren} from "../../internal/type";
import type {FormErrorDisplayMode, FormValidationContextType} from "./context";
import "./index.less";

export interface Props {
    children: React.ReactNode;
    id?: string;
    className?: string;
    style?: React.CSSProperties;
    layout?: "horizontal" | "vertical" | "inline";
    errorDisplayMode?: FormErrorDisplayMode;
    loading?: boolean;
    onFinish?: () => void;
    buttonText?: string;
    buttonDisabled?: boolean;
    buttonStyle?: React.CSSProperties;
    buttonRenderer?: ((submitButton: React.ReactElement, isValidating: boolean, loading?: boolean) => React.ReactElement) | null;
}

interface State {
    isValidating: boolean;
}

export class Form extends React.PureComponent<Props, State> {
    static displayName = "Form";
    static defaultProps: PickOptional<Props> = {
        layout: "horizontal",
        errorDisplayMode: {type: "extra"},
    };
    static Item = Item;

    private readonly validationContext: FormValidationContextType;
    private validators: Array<() => Promise<boolean>> = [];

    constructor(props: Props) {
        super(props);

        this.state = {
            isValidating: false,
        };

        this.validationContext = {
            registerValidator: validator => this.validators.push(validator),
            unregisterValidator: validator => {
                const index = this.validators.indexOf(validator);
                if (index >= 0) {
                    this.validators.splice(index, 1);
                }
            },
            errorDisplayMode: () => this.props.errorDisplayMode!,
        };
    }

    // Exposed for outer ref use, not recommended
    triggerSubmit = async () => {
        const {onFinish} = this.props;
        try {
            this.setState({isValidating: true});
            const validatorResults = await Promise.all(this.validators.map(_ => _()));
            if (validatorResults.every(_ => _)) {
                // Also true even if validatorResults is []
                onFinish?.();
                return true;
            }
            return false;
        } finally {
            this.setState({isValidating: false});
        }
    };

    onSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        event.stopPropagation();
        await this.triggerSubmit();
    };

    renderSubmitButton() {
        const {loading, buttonRenderer: defaultButtonRenderer, buttonDisabled, buttonStyle, buttonText} = this.props;
        const {isValidating} = this.state;
        const buttonRenderer = defaultButtonRenderer === undefined ? (submitButton: React.ReactElement) => submitButton : defaultButtonRenderer;
        const t = i18n();

        const submitButton = (
            <Button className="g-form-submit-button" type="submit" style={buttonStyle} disabled={isValidating || buttonDisabled}>
                {isValidating || loading ? <Spin spinning size="small" /> : buttonText || t.submit}
            </Button>
        );

        return buttonRenderer !== null ? <Form.Item className="g-form-submit-form-item">{buttonRenderer(submitButton, isValidating, loading)}</Form.Item> : null;
    }

    render() {
        const {children, id, className, style, layout} = this.props;
        return (
            <form id={id} className={`g-form g-form-${layout} ${className || ""}`} style={style} onSubmit={this.onSubmit}>
                <FormValidationContext.Provider value={this.validationContext}>{children}</FormValidationContext.Provider>
                {this.renderSubmitButton()}
            </form>
        );
    }
}
