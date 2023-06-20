import React from "react";

type UnionIntrinsicElementProps = React.JSX.IntrinsicElements[keyof React.JSX.IntrinsicElements] & AnimatedBaseProps;
interface AnimationKeyframe {
    frames: Keyframe[] | PropertyIndexedKeyframes;
    options?: KeyframeAnimationOptions;
}
interface AnimatedBaseProps {
    enter?: AnimationKeyframe;
    exit?: AnimationKeyframe;
    onEntering?: () => void;
    onEntered?: () => void;
    onExiting?: () => void;
    onExited?: () => void;
}

function createAnimatedComponent(element: keyof React.JSX.IntrinsicElements): React.FunctionComponent<any> {
    function Animated(props: UnionIntrinsicElementProps) {
        const {children, ref, enter, exit, onEntered, onEntering, onExited, onExiting, __removed, __onExited, ...restProps} = props as UnionIntrinsicElementProps & {
            __removed?: boolean;
            __onExited?: () => void;
        };
        const exited = () => {
            __onExited?.();
            onExited?.();
        };
        const animationSettings = {enter, exit, onEntered, onEntering, onExiting, exited};
        const elementRef = React.useRef<Element | null>(null);
        const compositeRef = useCompositeRef(elementRef, typeof ref === "string" ? null : ref);

        const animationSettingsRef = React.useRef(animationSettings);
        animationSettingsRef.current = animationSettings;

        React.useLayoutEffect(() => {
            const element = elementRef.current;
            if (!element) return;

            const {enter, onEntered, onEntering} = animationSettingsRef.current;
            if (!enter || !enter.frames) {
                onEntered?.();
                return;
            }

            onEntering?.();
            const animation = element.animate(enter.frames, enter.options);
            if (onEntered) animation.onfinish = onEntered;

            return () => {
                animation.onfinish = null;
                animation.cancel();
            };
        }, []);

        React.useLayoutEffect(() => {
            const element = elementRef.current;
            if (typeof __removed !== "boolean" || __removed === false || !element) return;

            const {exit, onExiting, exited} = animationSettingsRef.current;
            if (!exit || !exit.frames) {
                exited();
                return;
            }

            onExiting?.();
            const animation = element.animate(exit.frames, exit.options);
            if (exited) animation.onfinish = exited;

            return () => {
                animation.cancel();
                animation.onfinish = null;
            };
        }, [__removed]);

        return React.createElement(element, {...(restProps as any), ref: compositeRef}, children);
    }

    Animated.$isAnimatedComponent = true;

    return Animated;
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

function useCompositeRef(...refs: Array<React.MutableRefObject<any> | React.RefCallback<any> | undefined | null>) {
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
