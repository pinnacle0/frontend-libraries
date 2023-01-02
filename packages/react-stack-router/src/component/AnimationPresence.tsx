import React, {isValidElement, useLayoutEffect, useRef} from "react";
import {invariant} from "../util/invariant";
import {Animated} from "./Animated";

interface Props {
    children: React.ReactNode;
}

type ElementState = "entered" | "exiting";

interface ArrayElement {
    element: React.ReactElement;
    index: number;
}

type ElementStatusMap = Map<React.Key, {state: ElementState} & ArrayElement>;

export function useForceUpdate() {
    const [, setState] = React.useState<any>();
    const forceUpdate = React.useCallback(() => setState({}), []);
    return forceUpdate;
}

function usePrevious<T>(value: T): T {
    const previous = useRef(value);

    useLayoutEffect(() => {
        previous.current = value;
    }, [value]);

    return previous.current;
}

function getKey(element: React.ReactElement): React.Key {
    invariant(element.key !== null, "Child of AnimatePresence has neither defined or assigned key");
    return element.key;
}

function calculateRemovedChildren(currentChldren: React.ReactElement[], previousChildren: React.ReactElement[]) {
    const currentKeys = currentChldren.map(_ => _.key);
    const removeds: ArrayElement[] = [];

    for (const [index, element] of previousChildren.entries()) {
        if (!currentKeys.includes(getKey(element))) {
            removeds.push({element, index});
        }
    }

    return removeds;
}

function getValidChildren(children: React.ReactNode): Array<React.ReactElement> {
    const validElements: React.ReactElement[] = [];

    React.Children.forEach(children, element => {
        if (!isValidElement(element)) return;
        invariant(element.type === Animated, `<${element.type}> is not a <Animated> component. All children of <AnimatePresence> should be <Animated>`);
        invariant(element.key !== null, `<Animated> must have a specified key`);

        validElements.push(element as React.ReactElement);
    });

    return validElements;
}

export const AnimatePresence = ({children}: Props) => {
    const validChildren = getValidChildren(children);
    const previousValidChildren = usePrevious(validChildren);
    const statusMapRef = useRef<ElementStatusMap>(new Map());
    const forceUpdate = useForceUpdate();

    const statusMap = statusMapRef.current;

    validChildren.forEach((element, index) => {
        const key = getKey(element);
        const elementStatus = statusMap.get(key);
        if (elementStatus) {
            statusMap.set(key, {
                ...elementStatus,
                state: "entered",
                element: React.cloneElement(element, {__removed: false, __onExited: undefined}),
            });
        } else {
            statusMap.set(key, {state: "entered", index, element});
        }
    });

    const removeds = calculateRemovedChildren(validChildren, previousValidChildren);

    removeds.forEach(removed => {
        const key = getKey(removed.element);
        statusMap.set(key, {
            state: "exiting",
            index: removed.index,
            element: React.cloneElement(removed.element, {
                __removed: true,
                __onExited: () => {
                    statusMapRef.current.delete(key);
                    forceUpdate();
                },
            }),
        });
    });

    const childrenToRender: React.ReactElement[] = [];

    for (const [, {index, element}] of statusMap) {
        childrenToRender.splice(index, 0, element);
    }

    return <React.Fragment>{childrenToRender}</React.Fragment>;
};
