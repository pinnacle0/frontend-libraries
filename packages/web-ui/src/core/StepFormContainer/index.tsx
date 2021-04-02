import React from "react";
import {i18n} from "../../internal/i18n/core";
import type {SafeReactChild} from "../../internal/type";
import {Button} from "../Button";
import {FormContainer} from "../FormContainer";
import {Space} from "../Space";
import {Steps} from "../Steps";
import "./index.less";

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
    id?: string;
    className?: string;
    style?: React.CSSProperties;
    formLayout?: "horizontal" | "vertical";
    buttonRenderer?: (prevButton: React.ReactElement, nextButton: React.ReactElement) => React.ReactElement;
}

export class StepFormContainer extends React.PureComponent<Props> {
    static displayName = "StepFormContainer";

    goToPrevStep = () => this.props.onStepChange(this.props.currentStep - 1);

    goToNextStep = () => this.props.onStepChange(this.props.currentStep + 1);

    renderButtons = (submitButton: React.ReactElement, isValidating: boolean) => {
        const {currentStep, buttonRenderer = (prevButton, nextButton) => (currentStep > 0 ? [prevButton, nextButton] : nextButton)} = this.props;
        const t = i18n();
        const prevButton = (
            <Button color="wire-frame" onClick={this.goToPrevStep} disabled={isValidating} key="prevButton">
                {t.prevStep}
            </Button>
        );
        return <Space>{buttonRenderer(prevButton, submitButton)}</Space>;
    };

    render() {
        const {stepLabelPlacement, formLayout, currentStep, steps, onFinish, style, className, id} = this.props;
        const t = i18n();
        const nextButtonText = currentStep !== steps.length - 1 ? t.nextStep : t.finish;

        return (
            <div className={`g-step-form-container ${className || ""}`} id={id} style={style}>
                <Steps current={currentStep} labelPlacement={stepLabelPlacement}>
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
