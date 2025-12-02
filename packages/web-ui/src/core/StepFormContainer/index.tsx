import React from "react";
import {i18n} from "../../internal/i18n/core";
import {classNames} from "../../util/ClassNames";
import {Button} from "../Button";
import {Form} from "../Form";
import {Space} from "../Space";
import {Steps} from "../Steps";
import "./index.less";
import {ReactUtil} from "../../util/ReactUtil";

export interface StepItem {
    title: string;
    content: React.ReactElement | string | number;
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

export const StepFormContainer = ReactUtil.memo("StepFormContainer", (props: Props) => {
    const {
        stepLabelPlacement,
        formLayout,
        currentStep,
        steps,
        onFinish,
        style,
        className,
        id,
        onStepChange,
        buttonRenderer = (prevButton, nextButton) => (currentStep > 0 ? [prevButton, nextButton] : nextButton),
    } = props;
    const t = i18n();

    const goToPrevStep = () => onStepChange(currentStep - 1);

    const goToNextStep = () => onStepChange(currentStep + 1);

    const renderButtons = (submitButton: React.ReactElement, isValidating: boolean) => {
        const prevButton = (
            <Button onClick={goToPrevStep} disabled={isValidating} key="prevButton" type="primary" ghost>
                {t.prevStep}
            </Button>
        );
        return <Space>{buttonRenderer(prevButton, submitButton)}</Space>;
    };

    const nextButtonText = currentStep !== steps.length - 1 ? t.nextStep : t.finish;
    return (
        <div className={classNames("g-step-form-container", className)} id={id} style={style}>
            <Steps
                current={currentStep}
                titlePlacement={stepLabelPlacement}
                responsive={stepLabelPlacement !== "horizontal"}
                items={steps.map((step, index) => ({key: index, title: step.title, content: step.description}))}
            />
            <Form layout={formLayout} onFinish={currentStep < steps.length - 1 ? goToNextStep : onFinish} buttonText={nextButtonText} buttonRenderer={renderButtons}>
                {steps[currentStep].content}
            </Form>
        </div>
    );
});
