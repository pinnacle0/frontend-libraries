import React from "react";
import {Steps} from "./Steps";
import {Button} from "./Button";
import {i18n} from "../internal/i18n/core";
import type {SafeReactChild} from "../internal/type";
import {FormContainer} from "./FormContainer";
import {Space} from "./Space";

export interface StepItem {
    title: string;
    content: SafeReactChild;
    description?: string;
}

export interface Props {
    currentStep: number;
    steps: StepItem[];
    onStepChange: (step: number) => void;
    onFinish: () => void;
    stepLabelPlacement?: "horizontal" | "vertical"; // Default: horizontal
    className?: string;
    style?: React.CSSProperties;
    formLayout?: "horizontal" | "vertical";
    // TODO/Lok: buttonRenderer?: (prevButton, nextButton, isValidating) => ReactElement
}

export class StepFormContainer extends React.PureComponent<Props> {
    static displayName = "StepFormContainer";

    private readonly stepBarStyle: React.CSSProperties = {marginBottom: 20};

    goToPrevStep = () => this.props.onStepChange(this.props.currentStep - 1);

    goToNextStep = () => this.props.onStepChange(this.props.currentStep + 1);

    renderButtons = (submitButton: React.ReactElement, isValidating: boolean) => {
        const {currentStep} = this.props;
        const t = i18n();

        // TODO/Lok: remove className here
        return (
            <Space>
                {currentStep > 0 && (
                    <Button color="wire-frame" className="g-step-form-previous-button" onClick={this.goToPrevStep} disabled={isValidating}>
                        {t.prevStep}
                    </Button>
                )}
                {submitButton}
            </Space>
        );
    };

    render() {
        const {stepLabelPlacement, formLayout, currentStep, steps, onFinish, style, className} = this.props;
        const t = i18n();
        const nextButtonText = currentStep !== steps.length - 1 ? t.nextStep : t.finish;

        return (
            <div className={`g-step-form-container ${className || ""}`} style={style}>
                <Steps current={currentStep} labelPlacement={stepLabelPlacement} style={this.stepBarStyle}>
                    {steps.map((_, key) => (
                        <Steps.Step key={key} title={_.title} description={_.description} />
                    ))}
                </Steps>
                <FormContainer layout={formLayout} onFinish={currentStep < steps.length - 1 ? this.goToNextStep : onFinish} buttonText={nextButtonText} buttonRenderer={this.renderButtons}>
                    {steps[currentStep].content}
                </FormContainer>
            </div>
        );
    }
}
