import React, {useEffect, useRef} from "react";
import classNames from "classnames";
import type {Screen} from "../../stackRouter/screen";

export type AnimationKeyFrame = Keyframe[] | PropertyIndexedKeyframes | null;

interface Props {
    screen: Screen;
    className: string;
    children: React.ReactNode;
}

export const ScreenComponent = (props: Props) => {
    const {screen, className, children, __removed, __onExited} = props as Props & {
        __onExited?: () => void;
        __removed?: boolean;
    };
    const screenRef = useRef<Screen>(screen);
    const elementRef = useRef<HTMLDivElement | null>(null);
    const onExitRef = useRef(__onExited);

    screenRef.current = screen;
    onExitRef.current = __onExited;

    useEffect(() => {
        const el = elementRef.current;
        if (!el) return;
        const {transition, hooks} = screenRef.current;
        const keyframes = transition.enteringKeyframes;

        hooks.onWillEnter?.();
        if (!keyframes) {
            hooks.onDidEnter?.();
            return;
        }

        const animation = el.animate(keyframes, {
            duration: transition.duration,
            fill: "forwards",
            easing: "cubic-bezier(.05,.74,.3,1.01)",
        });
        animation.onfinish = hooks.onDidEnter ?? null;

        return () => animation.cancel();
    }, []);

    useEffect(() => {
        const el = elementRef.current;
        if (!el || !__removed) return;
        const {transition, hooks} = screenRef.current;
        const keyframes = transition.exitingKeyframes;

        hooks.onWillExit?.();
        if (!keyframes) {
            onExitRef.current?.();
            hooks.onDidExit?.();
            return;
        }

        const animation = el.animate(keyframes, {
            duration: transition.duration,
            easing: "cubic-bezier(.05,.74,.3,1.01)",
            fill: "forwards",
        });

        animation.onfinish = () => {
            onExitRef.current?.();
            hooks.onDidExit?.();
        };

        return () => animation.cancel();
    }, [__removed]);

    return (
        <div className={classNames("g-stack-router-screen", className, {exiting: __removed})} ref={elementRef}>
            {children}
        </div>
    );
};
