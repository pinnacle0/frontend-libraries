import React from "react";
import {usePrevious} from "../../hooks/usePrevious";
import {useForceUpdate} from "../../hooks/useForceUpdate";

interface ArrayElement {
    element: React.ReactElement;
    index: number;
}
export interface Props {
    children: React.ReactNode;
}

/**
 * Presence exit animation of the element
 * All direct children of AnimatePresence must be <Animated />, and each one must have a unique key (index will NOT work)
 */
export const AnimatePresence = ({children}: Props) => {
    const validChildren = getValidChildren(children);
    const previousValidChildren = usePrevious(validChildren);
    const elementStatusMapRef = React.useRef(new Map<React.Key, ArrayElement>());
    const forceUpdate = useForceUpdate();

    const elementStatusMap = elementStatusMapRef.current;
    validChildren.forEach((element, index) => {
        const key = getKey(element);
        const elementStatus = elementStatusMap.get(key);
        if (elementStatus) {
            elementStatusMap.set(key, {
                ...elementStatus,
                // __removed exist to prevent re-trigger hook when exiting
                element: React.cloneElement(element, {__removed: false, __onExited: undefined}),
            });
        } else {
            elementStatusMap.set(key, {index, element: React.cloneElement(element, {__removed: false, __onExited: undefined})});
        }
    });

    const removedChildren = calculateRemovedChildren(validChildren, previousValidChildren);

    removedChildren.forEach(removed => {
        const key = getKey(removed.element);
        elementStatusMap.set(key, {
            index: removed.index,
            element: React.cloneElement(removed.element, {
                __removed: true,
                __onExited: () => {
                    elementStatusMapRef.current.delete(key);
                    forceUpdate();
                },
            }),
        });
    });

    const childrenToRender: React.ReactElement[] = [];

    console.log("\n\n");
    console.log("elementStatusMap ---------");
    for (const [, {index, element}] of elementStatusMap) {
        console.log(index, element);
        childrenToRender.splice(index, 0, element);
    }
    console.log("elementStatusMap ---------- end");

    console.log("childrenToRender", childrenToRender);
    console.log("\n\n");

    return <div className="g-animate-presence">{childrenToRender}</div>;
};

function getKey(element: React.ReactElement): React.Key {
    invariant(element.key !== null, "Child of AnimatePresence has neither defined or assigned key");
    return element.key;
}

function calculateRemovedChildren(currentChildren: React.ReactElement[], previousChildren: React.ReactElement[]) {
    const currentKeys = new Set(currentChildren.map(_ => _.key));
    const removedChildren: ArrayElement[] = [];

    for (const [index, element] of previousChildren.entries()) {
        if (!currentKeys.has(getKey(element))) {
            removedChildren.push({element, index});
        }
    }

    return removedChildren;
}

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
