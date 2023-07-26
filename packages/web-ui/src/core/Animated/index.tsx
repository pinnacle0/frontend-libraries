import type React from "react";
import {createAnimatedComponent, type AnimatedBaseProps} from "./createAnimatedComponent";

export type AnimatedType<T extends keyof React.JSX.IntrinsicElements = keyof React.JSX.IntrinsicElements> = {
    [key in T]: React.ComponentType<React.JSX.IntrinsicElements[key] & AnimatedBaseProps>;
};

const componentCache = new Map<string, Function>();
export const RawAnimated: any = new Proxy(
    {},
    {
        get(_, key: string) {
            let component = componentCache.get(key);
            if (!component) {
                component = createAnimatedComponent(key as any);
                componentCache.set(key, component);
            }
            return component;
        },
    }
);

/**
 * Why favour <Animated.div/> over <Animated variant="div" /> ?
 * LATER ONE IS SLOW. The intellisense (code completion) will be so slow that it completely destroy DX, especially in IDEA
 * Seem like the LSP will try to calculate the props type base on all key of React.JSX.IntrinsicElements
 * Don't know exactly why. But it's slow as hell
 */
export const Animated: AnimatedType = RawAnimated as AnimatedType;
export {AnimatePresence} from "./AnimatePresence";
export type {AnimationKeyframe, AnimatedKeyframeGenerator} from "./createAnimatedComponent";
