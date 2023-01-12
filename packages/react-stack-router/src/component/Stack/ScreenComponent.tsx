import React, {useEffect, useRef} from "react";
import classNames from "classnames";
import type {Screen} from "../../stackRouter/screen";
import {RouteContext} from "../../context";

export type AnimationKeyFrame = Keyframe[] | PropertyIndexedKeyframes | null;

interface Props {
    screen: Screen;
    className: string;
}

export const ScreenComponent = (props: Props) => {
    const {screen, className, __removed, __onExited} = props as Props & {
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
        const {transition, lifecycle} = screenRef.current;
        const keyframes = transition.enteringKeyframes;

        lifecycle.trigger("willEnter");
        if (!keyframes) {
            lifecycle.trigger("didEnter");
            return;
        }

        const animation = el.animate(keyframes, {
            duration: transition.duration,
            fill: "forwards",
            easing: "cubic-bezier(.05,.74,.3,1.01)",
        });

        animation.onfinish = () => lifecycle.trigger("didEnter");
        return () => animation.cancel();
    }, []);

    useEffect(() => {
        const el = elementRef.current;
        if (!el || !__removed) return;
        const {transition, lifecycle} = screenRef.current;
        const keyframes = transition.exitingKeyframes;

        lifecycle.trigger("willExit");
        if (!keyframes) {
            onExitRef.current?.();
            lifecycle.trigger("didExit");
            return;
        }

        const animation = el.animate(keyframes, {
            duration: transition.duration,
            easing: "cubic-bezier(.05,.74,.3,1.01)",
            fill: "forwards",
        });

        animation.onfinish = () => {
            onExitRef.current?.();
            lifecycle.trigger("didExit");
        };

        return () => animation.cancel();
    }, [__removed]);

    return (
        <div className={classNames("g-stack-router-screen", className, {exiting: __removed})} ref={elementRef}>
            <RouteContext.Provider value={{params: screen.history.params, location: screen.history.location, lifecycle: screen.lifecycle}}>
                <screen.content />
            </RouteContext.Provider>
        </div>
    );
};
