import React from "react";
import Slider from "@pinnacle0/web-ui/core/Slider";
import type {SafeReactChildren} from "@pinnacle0/web-ui/internal/type";
import {withUncontrolledInitialValue} from "../../util/withUncontrolledInitialValue";
import type {DemoHelperGroupConfig} from "../DemoHelper";
import {DemoHelper} from "../DemoHelper";

const UncontrolledSlider = withUncontrolledInitialValue(Slider);

const UncontrolledRangeSlider = withUncontrolledInitialValue(Slider.Range);

// Slider uses parent height if not specified, parent with 0 width means slider have 0 width
const HasWidth = ({children, width = 200}: {children: SafeReactChildren; width?: number}) => <div style={{width}}>{children}</div>;

const groups: DemoHelperGroupConfig[] = [
    {
        title: "Slider Demo",
        showPropsHint: true,
        components: [
            <HasWidth>
                <UncontrolledSlider initialValue={0} />
            </HasWidth>,
            <UncontrolledSlider initialValue={3} min={2} max={9} style={{width: 300}} />,
            <UncontrolledSlider initialValue={3} min={-5} max={9} style={{width: 300}} />,
            <UncontrolledSlider initialValue={3} min={-5} max={9} style={{width: 300}} marks={{3: "Initial", [-5]: "min", 9: "max"}} />,
            "-",
            <UncontrolledSlider initialValue={3} min={-5} max={9} style={{width: 300}} marks={{3: "Initial", [-5]: "min", 9: "max"}} showButton />,
        ],
    },
    {
        title: "Slider.Range Demo",
        showPropsHint: true,
        components: [
            <HasWidth>
                <UncontrolledRangeSlider initialValue={[0, 0]} />
            </HasWidth>,
        ],
    },
];

export const SliderDemo = () => <DemoHelper groups={groups} />;