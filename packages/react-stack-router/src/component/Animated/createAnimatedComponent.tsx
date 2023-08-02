import React from "react";
import classNames from "classnames";

export interface AnimationKeyframe {
    frames: Keyframe[] | PropertyIndexedKeyframes;
    options?: KeyframeAnimationOptions;
}

export type AnimatedKeyframeGenerator = AnimationKeyframe | ((node: Element) => AnimationKeyframe | void | null) | null;

export interface AnimatedBaseProps {
    enter?: AnimatedKeyframeGenerator;
    exit?: AnimatedKeyframeGenerator;
    onEntering?: () => void;
    onEntered?: () => void;
    onExiting?: () => void;
    onExited?: () => void;
}

type UnionIntrinsicElementProps = React.JSX.IntrinsicElements[keyof React.JSX.IntrinsicElements] & AnimatedBaseProps;

export function createAnimatedComponent(element: keyof React.JSX.IntrinsicElements): React.FunctionComponent<any> {
    const Animated = React.forwardRef(function (props: UnionIntrinsicElementProps, ref) {
        const {children, enter, exit, onEntered, onEntering, onExited, onExiting, className, __removed, __onExited, ...restProps} = props as UnionIntrinsicElementProps & {
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
            const keyframe = typeof enter === "function" ? enter(element) : enter;

            onEntering?.();
            if (!keyframe) {
                onEntered?.();
                return;
            }

            const animation = element.animate(keyframe.frames, keyframe.options);
            animation.onfinish = () => {
                onEntered?.();
            };

            return () => {
                animation.onfinish = null;
            };
        }, []);

        React.useLayoutEffect(() => {
            const element = elementRef.current;
            if (typeof __removed !== "boolean" || __removed === false || !element) return;

            const {exit, onExiting, exited} = animationSettingsRef.current;
            const keyframe = typeof exit === "function" ? exit(element) : exit;

            onExiting?.();
            if (!keyframe) {
                exited();
                return;
            }

            const animation = element.animate(keyframe.frames, keyframe.options);
            animation.onfinish = exited;

            return () => {
                animation.cancel();
                animation.onfinish = null;
            };
        }, [__removed]);

        return React.createElement(element, {...(restProps as any), ref: compositeRef, className: classNames(className, {removing: __removed})}, children);
    });

    Object.defineProperty(Animated, "$isAnimatedComponent", {value: true, enumerable: false, writable: false});
    Object.defineProperty(Animated, "displayName", {value: `Animated.${element}`, enumerable: false, writable: false});

    return Animated;
}

export function useCompositeRef(...refs: Array<React.MutableRefObject<any> | React.RefCallback<any> | undefined | null>) {
    const refListRef = React.useRef(refs);
    return React.useCallback((node: Node | null) => {
        refListRef.current.forEach(ref => {
            if (!ref) return;
            if (typeof ref === "function") {
                ref(node);
            } else {
                ref.current = node;
            }
        });
    }, []);
}
