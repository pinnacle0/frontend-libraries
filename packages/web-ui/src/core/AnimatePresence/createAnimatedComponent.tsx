import React from "react";
import {useCompositeRef} from "../../hooks/useCompositeRef";

export interface AnimationKeyframe {
    frames: Keyframe[] | PropertyIndexedKeyframes;
    options?: KeyframeAnimationOptions;
}

export interface AnimatedBaseProps {
    enter?: AnimationKeyframe | (() => AnimationKeyframe);
    exit?: AnimationKeyframe | (() => AnimationKeyframe);
    onEntering?: () => void;
    onEntered?: () => void;
    onExiting?: () => void;
    onExited?: () => void;
}

type UnionIntrinsicElementProps = React.JSX.IntrinsicElements[keyof React.JSX.IntrinsicElements] & AnimatedBaseProps;

export function createAnimatedComponent(element: keyof React.JSX.IntrinsicElements): React.FunctionComponent<any> {
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
            if (!enter) {
                onEntered?.();
                return;
            }
            const keyframe = typeof enter === "function" ? enter() : enter;

            onEntering?.();
            const animation = element.animate(keyframe.frames, keyframe.options);
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
            if (!exit) {
                exited();
                return;
            }
            const keyframe = typeof exit === "function" ? exit() : exit;

            onExiting?.();
            const animation = element.animate(keyframe.frames, keyframe.options);
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
