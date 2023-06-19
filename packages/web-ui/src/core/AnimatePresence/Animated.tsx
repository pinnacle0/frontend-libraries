import React from "react";

type UnionIntrinsicElementProps = React.JSX.IntrinsicElements[keyof React.JSX.IntrinsicElements] & AnimatedBaseProps;

function createAnimatedComponent(element: keyof React.JSX.IntrinsicElements): React.FunctionComponent<any> {
    function Animated(props: UnionIntrinsicElementProps) {
        const {children, ref: userRef, enter, exit, enterOptions, exitOptions, ...restProps} = props;
        const elementRef = React.useRef<Element | null>(null);
        const ref = compositeRef(elementRef, typeof userRef === "string" ? null : userRef);
        const frames = React.useRef({
            enter,
            exit,
            enterOptions,
            exitOptions,
        });

        frames.current = {
            enter,
            exit,
            enterOptions,
            exitOptions,
        };

        React.useLayoutEffect(() => {
            const element = elementRef.current;
            if (!element) return;
            const animation = element.animate(frames.current.enter ?? null, frames.current.enterOptions);

            return () => animation.cancel();
        }, []);

        return React.createElement(element, {...(restProps as any), ref}, children);
    }

    Animated.$isAnimatedComponent = true;

    return Animated;
}

interface AnimatedBaseProps {
    enter?: Keyframe[] | PropertyIndexedKeyframes;
    enterOptions?: KeyframeAnimationOptions;
    exit?: Keyframe[] | PropertyIndexedKeyframes;
    exitOptions?: KeyframeAnimationOptions;
}

export type AnimatedType<T extends keyof React.JSX.IntrinsicElements = keyof React.JSX.IntrinsicElements> = {
    [key in T]: React.ComponentType<React.JSX.IntrinsicElements[key] & AnimatedBaseProps>;
};

const componentCache = new Map<string, Function>();
export const RawAnimated: any = new Proxy(
    {},
    {
        get(target, key: string) {
            let component = componentCache.get(key);
            if (!component) {
                component = createAnimatedComponent(key as any);
                componentCache.set(key, component);
            }
            return component;
        },
    }
);

export const animated: AnimatedType = RawAnimated as AnimatedType;

function compositeRef(...refs: Array<React.MutableRefObject<any> | React.RefCallback<any> | undefined | null>) {
    return (node: Node) => {
        refs.forEach(ref => {
            if (!ref) return;
            if (typeof ref === "function") {
                ref(node);
            } else {
                ref.current = node;
            }
        });
    };
}
