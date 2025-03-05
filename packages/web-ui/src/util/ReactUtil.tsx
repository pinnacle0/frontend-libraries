import React from "react";

function joinNodes(nodes: React.ReactNode[], separator: React.ReactElement | string, outerJoin: boolean = false): React.ReactElement {
    // Do not use nodes.reduce, because it fails to handle key(prop) perfectly.
    const joinedNodes: React.ReactElement[] = nodes.map((_, index) => (
        <React.Fragment key={index}>
            {_}
            {index < nodes.length - 1 && separator}
        </React.Fragment>
    ));
    if (outerJoin) {
        joinedNodes.unshift(<React.Fragment key="__first__">{separator}</React.Fragment>);
        joinedNodes.push(<React.Fragment key="__last__">{separator}</React.Fragment>);
    }
    return <React.Fragment>{joinedNodes}</React.Fragment>;
}

/**
 * For React Native UI, parameters must be Text-based node
 * Currently, only support placeholders {1} {2} in sequence
 *
 * E.g: interpolateNode("Dice {1} Prize {2}", <Dice value={6}/>, <Amount value={3.5}/>)
 */
function interpolateNode(text: string, ...parameters: React.ReactElement[]): React.ReactElement {
    const nodes: Array<React.ReactElement | string> = [];
    text.split(/\{\d+\}/g).forEach((_, index) => {
        nodes.push(_);
        nodes.push(parameters[index]);
    });
    return <React.Fragment>{nodes}</React.Fragment>;
}

/**
 * Similar to React.memo, differences are:
 * - Preserves the generic of component props if there are any
 * - Adds a parameter to assign displayName to component
 *
 * Example usage:
 *   interface Props<T extends string> {
 *       tabs: ReadonlyArray<TabType<T>>;
 *   }
 *   export const Tabs = ReactUtil.memo("Tabs", function<T extends string>(props: Props<T>) { .... });
 */
function memo<T extends React.FunctionComponent<any>>(displayName: string, functionComponent: T): T {
    return (React.memo as <T>(c: T) => T)(Object.assign(functionComponent, {displayName}));
}

/**
 * To group some components into a static-method like usage, without creating dummy class.
 *
 * Example usage:
 *    const Left = ReactUtil.memo("Left", () => {...});
 *    const Right = ReactUtil.memo("Left", () => {...});
 *    const SomeContainer = ReactUtil.statics("SomeContainer", {Left, Right})
 *
 * Then you can use <SomeContainer.Left> or <SomeContainer.Right> with proper displayName set.
 */
function statics<T extends {[key: string]: React.ComponentType<any> | {[key: string]: React.ComponentType<any>}}>(displayName: string, componentMap: T): T {
    const namedComponentMap: {[key: string]: React.ComponentType<any> | {[key: string]: React.ComponentType<any>}} = {};
    Object.entries(componentMap).forEach(([key, componentOrMap]) => {
        if (typeof componentOrMap === "function") {
            const Component = componentOrMap;
            namedComponentMap[key] = memo(displayName, (props: any) => <Component {...props} />);
        } else {
            const nestedComponentMap: {[key: string]: React.ComponentType<any>} = {};
            Object.entries(componentOrMap).forEach(([key, Component]) => {
                nestedComponentMap[key] = Component;
            });
            namedComponentMap[key] = nestedComponentMap;
        }
    });
    return namedComponentMap as T;
}

export const ReactUtil = Object.freeze({
    joinNodes,
    interpolateNode,
    memo,
    statics,
});
