import React from "react";
import {usePrevious} from "../../hooks/usePrevious";
import {useForceUpdate} from "../../hooks/useForceUpdate";

interface Props {
    children: React.ReactNode;
}

type ElementState = "entered" | "exiting";

interface ArrayElement {
    element: React.ReactElement;
    index: number;
}

type ElementStatusMap = Map<React.Key, {state: ElementState} & ArrayElement>;

export const AnimatePresence = ({children}: Props) => {
    const validChildren = getValidChildren(children);
    const ereviousValidChildren = usePrevious(validChildren);
    const statusMapRef = React.useRef<ElementStatusMap>(new Map());
    const forceUpdate = useForceUpdate();

    return <div className="g-animate-presence">{children}</div>;
};

function getValidChildren(children: React.ReactNode): Array<React.ReactElement> {
    const validElements: React.ReactElement[] = [];

    React.Children.forEach(children, element => {
        if (!React.isValidElement(element)) return;
        invariant(
            (element.type as any)?.$isAnimatedComponent === true,
            `<${element.type}> is not a Animated element. All children of <AnimatePresence> should be created from Animated, e.g. <Animated.div />`
        );
        invariant(element.key !== null, `Animated element must have a specified key`);

        validElements.push(element as React.ReactElement);
    });

    return validElements;
}

export function invariant(condition: any, message: string): asserts condition {
    if (condition) {
        return;
    }
    throw new Error(message);
}
