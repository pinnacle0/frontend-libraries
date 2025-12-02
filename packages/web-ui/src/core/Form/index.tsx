import React from "react";
import {classNames} from "../../util/ClassNames";
import {Button} from "../Button";
import {FormValidationContext} from "./context";
import {i18n} from "../../internal/i18n/core";
import {Item} from "./Item";
import {ReactUtil} from "../../util/ReactUtil";
import type {FormErrorDisplayMode} from "./context";
import "./index.less";

export type {Props as FormItemProps, FormValidator} from "./Item";

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
    buttonIcon?: React.ReactNode;
    buttonDisabled?: boolean;
    buttonStyle?: React.CSSProperties;
    buttonRenderer?: ((submitButton: React.ReactElement, isValidating: boolean, loading?: boolean) => React.ReactElement) | null;
    allowBrowserAutoComplete?: boolean;
}

export const Form = ReactUtil.compound("Form", {Item}, (props: Props) => {
    const {
        children,
        id,
        className,
        style,
        layout = "horizontal",
        allowBrowserAutoComplete,
        loading,
        buttonRenderer: defaultButtonRenderer,
        buttonStyle,
        buttonText,
        buttonIcon,
        buttonDisabled,
        onFinish,
        errorDisplayMode = {type: "extra"},
    } = props;
    const [isValidating, setIsValidating] = React.useState(false);
    const [validators, setValidators] = React.useState<Array<() => Promise<boolean>>>([]);
    const validationContext = React.useMemo(
        () => ({
            registerValidator: (validator: () => Promise<boolean>) => setValidators(prev => [...prev, validator]),
            unregisterValidator: (validator: () => Promise<boolean>) => setValidators(prev => prev.filter(v => v !== validator)),
            errorDisplayMode: () => errorDisplayMode,
        }),
        [errorDisplayMode]
    );

    const onSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        event.stopPropagation();
        try {
            setIsValidating(true);
            const validatorResults = await Promise.all(validators.map(_ => _()));
            if (validatorResults.every(_ => _)) {
                // Also true even if validatorResults is []
                onFinish?.();
                return true;
            }
            return false;
        } finally {
            setIsValidating(false);
        }
    };

    const renderSubmitButton = () => {
        const buttonRenderer = defaultButtonRenderer === undefined ? (submitButton: React.ReactElement) => submitButton : defaultButtonRenderer;
        const t = i18n();

        const submitButton = (
            <Button
                className="g-form-submit-button"
                htmlType="submit"
                type="primary"
                key="submitButton"
                style={buttonStyle}
                loading={isValidating || loading}
                icon={buttonIcon}
                disabled={buttonDisabled || isValidating || loading}
            >
                {buttonText || t.submit}
            </Button>
        );

        return buttonRenderer !== null ? <Form.Item className="g-form-submit-form-item">{buttonRenderer(submitButton, isValidating, loading)}</Form.Item> : null;
    };

    return (
        <form autoComplete={allowBrowserAutoComplete ? undefined : "off"} id={id} className={classNames("g-form", `g-form-${layout}`, className)} style={style} onSubmit={onSubmit}>
            <FormValidationContext.Provider value={validationContext}>{children}</FormValidationContext.Provider>
            {renderSubmitButton()}
        </form>
    );
});
