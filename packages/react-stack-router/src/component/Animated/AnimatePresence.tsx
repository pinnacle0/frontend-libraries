import React from "react";
import {invariant} from "../../invariant";

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
 * PS: This component will most likely have bugs, so please fix them if you find any. ⛑️
 */
export const AnimatePresence = ({children}: Props) => {
    const validChildren = getValidChildren(children);
    const previousValidChildren = usePrevious(validChildren);
    // render key of current rendered children, order matters
    const renderedKeyList = React.useRef<React.Key[]>(validChildren.map(_ => getKey(_)));
    const elementMapRef = React.useRef(new Map<React.Key, React.ReactElement>());
    const forceUpdate = useForceUpdate();

    const elementMap = elementMapRef.current;

    // update the element map, update element by key, it there are any revert of element removal, it will be updated here
    validChildren.map(element => elementMap.set(getKey(element), React.cloneElement(element, {__removed: false, __onExited: undefined})));

    // calculate removed children of this render cycle, and update the their props of the element element map
    const removedChildren = calculateRemovedChildren(validChildren, previousValidChildren);
    removedChildren.forEach(element => {
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

    // loop through the element map find the index of all removed element in current rendered children (according to the renderedKeyList)
    const removedChildrenRenderListIndex: number[] = [];
    elementMapRef.current.forEach((element, key) => {
        if (element.props.__removed) {
            const index = renderedKeyList.current.findIndex(_ => _ === key);
            if (index !== -1) {
                removedChildrenRenderListIndex.push(index);
            }
        }
    });

    // calculate added children and insert they into the renderedKeyList, the insert index is depend the number of removed children before it
    // eg. A element is added at index 2 in the original children, if there are 2 removed children before it, it will be inserted at index 4
    const addedChildren = calculateAddedChildren(validChildren, previousValidChildren);
    addedChildren.forEach(({element, index}) => {
        const key = getKey(element);
        if (renderedKeyList.current.includes(key)) return;
        const numOfRemovedChildrenBefore = removedChildrenRenderListIndex.filter(_ => _ <= index).length;
        renderedKeyList.current.splice(index + numOfRemovedChildrenBefore, 0, getKey(element));
    });

    // render the children according to the renderedKeyList
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

export function usePrevious<T>(value: T) {
    const ref = React.useRef({
        latest: value,
        previous: value,
    });

    if (value !== ref.current.latest) {
        ref.current = {
            latest: value,
            previous: ref.current.latest,
        };
    }

    return ref.current.previous;
}

export function useForceUpdate() {
    const [, setState] = React.useState<any>();
    const forceUpdate = React.useCallback(() => setState({}), []);
    return forceUpdate;
}
