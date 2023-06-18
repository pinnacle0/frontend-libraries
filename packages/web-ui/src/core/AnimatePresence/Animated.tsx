import React from "react";

const cache = new Map<string, Function>();

function createAnimatedComponent(element: keyof React.JSX.IntrinsicElements): React.FunctionComponent<any> {
    function Animated(props: any) {
        const {children, ...rest} = props;
        return React.createElement(element, {...rest}, children);
    }

    Animated.$isAnimatedComponent = true;

    return Animated;
}

export const RawAnimated: any = new Proxy(
    {},
    {
        get(target, key: string) {
            let component = cache.get(key);
            if (!component) {
                component = createAnimatedComponent(key as any);
                cache.set(key, component);
            }
            return component;
        },
    }
);

export type AnimatedType<T extends keyof React.JSX.IntrinsicElements = keyof React.JSX.IntrinsicElements> = {
    [key in T]: React.ComponentType<React.JSX.IntrinsicElements[key]>;
};

export const Animated: AnimatedType = RawAnimated as AnimatedType;
