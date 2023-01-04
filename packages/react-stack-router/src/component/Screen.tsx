import React, {useEffect, useRef} from "react";

export type AnimationKeyFrame = Keyframe[] | PropertyIndexedKeyframes | null;

interface Props {
    children: React.ReactNode;
    duration: number;
    onEnter: AnimationKeyFrame | (() => AnimationKeyFrame);
    onExit: AnimationKeyFrame | (() => AnimationKeyFrame);
    className?: string;
}

export const Screen = (props: Props) => {
    const {
        children,
        onEnter,
        onExit,
        duration = 300,
        __removed,
        __onExited,
        className,
    } = props as Props & {
        __onExited?: () => void;
        __removed?: boolean;
    };
    const elementRef = useRef<HTMLDivElement | null>(null);

    const onExitRef = useRef(__onExited);
    onExitRef.current = __onExited;

    const animationConfig = useRef({
        duration,
        onEnter,
        onExit,
    });

    animationConfig.current = {
        duration,
        onEnter,
        onExit,
    };

    useEffect(() => {
        const el = elementRef.current;
        const {onEnter, duration} = animationConfig.current;
        const keyframes = typeof onEnter === "function" ? onEnter() : onEnter;

        if (!el || !keyframes) return;

        const animation = el.animate(keyframes, {
            duration,
            fill: "forwards",
            easing: "cubic-bezier(.05,.74,.3,1.01)",
        });
        return () => animation.cancel();
    }, []);

    useEffect(() => {
        const el = elementRef.current;
        const {onExit, duration} = animationConfig.current;
        const keyframes = typeof onExit === "function" ? onExit() : onExit;
        if (!__removed || !el) return;
        if (!keyframes) {
            onExitRef.current?.();
            return;
        }

        const animation = el.animate(keyframes, {
            duration,
            easing: "cubic-bezier(.05,.74,.3,1.01)",
            fill: "forwards",
        });
        animation.onfinish = () => onExitRef.current?.();
        return () => animation.cancel();
    }, [__removed]);

    return (
        <div ref={elementRef} className={`g-stack-router-screen ${className ?? ""}`}>
            {children}
        </div>
    );
};
