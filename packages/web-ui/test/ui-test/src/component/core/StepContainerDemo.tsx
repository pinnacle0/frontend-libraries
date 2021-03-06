import React from "react";
import type {StepItem} from "@pinnacle0/web-ui/core/StepFormContainer";
import {StepFormContainer} from "@pinnacle0/web-ui/core/StepFormContainer";
import {Form} from "@pinnacle0/web-ui/core/Form";
import {Input} from "@pinnacle0/web-ui/core/Input";
import type {DemoHelperGroupConfig} from "../DemoHelper";
import {DemoHelper} from "../DemoHelper";

const FormItem = () => {
    const [value, setValue] = React.useState("");
    const validator = () => (value.length >= 2 ? new Promise<null>(resolve => setTimeout(() => resolve(null), 300)) : "Length at least 2");
    return (
        <Form.Item label="Name" extra="Length at least 2" validator={validator}>
            <Input value={value} onChange={setValue} />
        </Form.Item>
    );
};

const steps: StepItem[] = [
    {title: "one", content: <FormItem />},
    {title: "too", content: <FormItem />},
    {title: "free", content: <FormItem />},
];

const containerStyle: React.CSSProperties = {width: 800};

export const StepContainerDemo = () => {
    const [currentStep, setCurrentStep] = React.useState(1);

    const group: DemoHelperGroupConfig[] = [
        {
            title: "Step Container",
            showPropsHint: false,
            components: [<StepFormContainer currentStep={currentStep} steps={steps} onStepChange={setCurrentStep} onFinish={() => alert("Done")} style={containerStyle} />],
        },
        {
            title: "Step Container (Vertical Label)",
            showPropsHint: false,
            components: [
                <StepFormContainer
                    stepLabelPlacement="vertical"
                    currentStep={currentStep}
                    steps={steps}
                    onStepChange={setCurrentStep}
                    onFinish={() => alert("All steps finished")}
                    style={containerStyle}
                />,
            ],
        },
    ];

    return <DemoHelper groups={group} />;
};
