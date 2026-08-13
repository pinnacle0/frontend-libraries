import React from "react";
import {classNames} from "../../util/ClassNames";
import {Button} from "../Button";
import {FormValidationContext} from "./context";
import {i18n} from "../../internal/i18n/core";
import {Item} from "./Item";
import type {FormErrorDisplayMode} from "./context";
import "./index.less";
import {ReactUtil} from "../../util/ReactUtil";

export type {Props as FormItemProps, FormValidator} from "./Item";

export interface FormHandler {
    triggerSubmit: () => Promise<boolean>;
}

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

export const Form = ReactUtil.compound(
    "Form",
    {Item},
    React.forwardRef<FormHandler, Props>((props, forwardRef) => {
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
        // Ref (not state): Form.Item registers during render, so triggerSubmit must see
        // the latest validators in the same commit — before useEffect / a setState flush.
        const validatorsRef = React.useRef(new Set<() => Promise<boolean>>());
        const isSubmittingRef = React.useRef(false);

        const registerValidator = React.useCallback((validator: () => Promise<boolean>) => {
            validatorsRef.current.add(validator);
        }, []);
        const unregisterValidator = React.useCallback((validator: () => Promise<boolean>) => {
            validatorsRef.current.delete(validator);
        }, []);
        const validationContext = {
            registerValidator,
            unregisterValidator,
            errorDisplayMode: () => errorDisplayMode,
        };

        const triggerSubmit = async () => {
            if (isSubmittingRef.current) {
                return false;
            }
            isSubmittingRef.current = true;
            try {
                setIsValidating(true);
                const validatorResults = await Promise.all([...validatorsRef.current].map(_ => _()));
                if (validatorResults.every(_ => _)) {
                    // Also true even if validatorResults is [] (form has no Form.Item)
                    onFinish?.();
                    return true;
                }
                return false;
            } finally {
                isSubmittingRef.current = false;
                setIsValidating(false);
            }
        };

        React.useImperativeHandle(forwardRef, () => ({
            triggerSubmit,
        }));

        const onSubmit = async (event: React.FormEvent) => {
            event.preventDefault();
            event.stopPropagation();
            await triggerSubmit();
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
    })
);
