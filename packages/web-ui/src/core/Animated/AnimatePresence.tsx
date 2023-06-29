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
 * Caveat: insert and remove element by index during animation do not work as expected
 */
export const AnimatePresence = ({children}: Props) => {
    const validChildren = getValidChildren(children);
    const previousValidChildren = usePrevious(validChildren);
    const renderedKeyList = React.useRef<React.Key[]>(validChildren.map(_ => getKey(_)));
    const elementMapRef = React.useRef(new Map<React.Key, React.ReactElement>());
    const forceUpdate = useForceUpdate();

    const elementMap = elementMapRef.current;

    validChildren.map(element => elementMap.set(getKey(element), React.cloneElement(element, {__removed: false, __onExited: undefined})));

    const removedChildren = calculateRemovedChildren(validChildren, previousValidChildren);
    removedChildren.map(element => {
        const key = getKey(element);
        elementMap.set(
            key,
            React.cloneElement(element, {
                __removed: true,
                __onExited: () => {
                    elementMapRef.current.delete(key);
                    renderedKeyList.current = renderedKeyList.current.filter(_ => _ !== key);
                    forceUpdate();
                },
            })
        );
    });

    const addedChildren = calculateAddedChildren(validChildren, previousValidChildren);
    addedChildren.forEach(({element, index}) => {
        const key = getKey(element);
        if (renderedKeyList.current.includes(key)) return;
        renderedKeyList.current.splice(index, 0, getKey(element));
    });

    const childrenToRender: React.ReactElement[] = renderedKeyList.current.map(key => elementMap.get(key)!);

    return <React.Fragment>{childrenToRender}</React.Fragment>;
};

function getKey(element: React.ReactElement): React.Key {
    invariant(element.key !== null, "Child of AnimatePresence has neither defined or assigned key");
    return element.key;
}

function calculateRemovedChildren(currentChildren: React.ReactElement[], previousChildren: React.ReactElement[]): React.ReactElement[] {
    const currentKeys = new Set(currentChildren.map(_ => _.key));
    const removedChildren: React.ReactElement[] = [];

    for (const [, element] of previousChildren.entries()) {
        if (!currentKeys.has(getKey(element))) {
            removedChildren.push(element);
        }
    }

    return removedChildren;
}

function calculateAddedChildren(currentChildren: React.ReactElement[], previousChildren: React.ReactElement[]): ArrayElement[] {
    const previousKeys = new Set(previousChildren.map(_ => _.key));
    const addedChildren: ArrayElement[] = [];

    for (const [index, element] of currentChildren.entries()) {
        if (!previousKeys.has(getKey(element))) {
            addedChildren.push({element, index});
        }
    }

    return addedChildren;
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
