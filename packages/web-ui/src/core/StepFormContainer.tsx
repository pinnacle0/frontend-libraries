import React from "react";
import {Steps} from "./Steps";
import {Button} from "./Button";
import {i18n} from "../internal/i18n/core";
import type {SafeReactChild} from "../internal/type";
import {FormContainer} from "./FormContainer";

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
    /** Defaults to "horizontal" */
    stepLabelPlacement?: "horizontal" | "vertical";
    className?: string;
    style?: React.CSSProperties;
}

export class StepFormContainer extends React.PureComponent<Props> {
    static displayName = "StepFormContainer";

    private readonly prevButtonStyle: React.CSSProperties = {marginRight: 20};

    goToPrevStep = () => this.props.onStepChange(this.props.currentStep - 1);

    goToNextStep = () => this.props.onStepChange(this.props.currentStep + 1);

    renderButtons = (submitButton: React.ReactElement, isValidating: boolean) => {
        const {currentStep} = this.props;
        const t = i18n();

        return (
            <React.Fragment>
                {currentStep > 0 && (
                    <Button color="wire-frame" className="g-step-form-previous-button" onClick={this.goToPrevStep} disabled={isValidating} style={this.prevButtonStyle}>
                        {t.prevStep}
                    </Button>
                )}
                {submitButton}
            </React.Fragment>
        );
    };

    render() {
        const {stepLabelPlacement, currentStep, steps, onFinish, style, className} = this.props;
        const t = i18n();
        const nextButtonText = currentStep !== steps.length - 1 ? t.nextStep : t.finish;

        return (
            <div className={`g-step-container ${className || ""}`} style={style}>
                <Steps current={currentStep} labelPlacement={stepLabelPlacement}>
                    {steps.map((_, key) => (
                        <Steps.Step key={key} title={_.title} description={_.description} />
                    ))}
                </Steps>
                <FormContainer onFinish={currentStep < steps.length - 1 ? this.goToNextStep : onFinish} buttonText={nextButtonText} buttonRenderer={this.renderButtons}>
                    {steps[currentStep].content}
                </FormContainer>
            </div>
        );
    }
}
