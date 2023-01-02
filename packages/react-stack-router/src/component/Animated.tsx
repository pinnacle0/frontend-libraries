import React, {useEffect, useRef} from "react";

interface Props extends React.DetailedHTMLProps<React.HtmlHTMLAttributes<HTMLDivElement>, HTMLDivElement> {
    ref?: React.MutableRefObject<HTMLDivElement> | React.RefCallback<HTMLDivElement>;
    onEnter: Keyframe[] | PropertyIndexedKeyframes | null;
    onExit: Keyframe[] | PropertyIndexedKeyframes | null;
    duration?: number;
}

export const Animated = (props: Props) => {
    const {
        children,
        onEnter,
        onExit,
        ref,
        duration = 300,
        __removed,
        __onExited,
        className,
        ...restProps
    } = props as Props & {
        __onExited?: () => void;
        __removed?: boolean;
    };
    const elementRef = useRef<HTMLDivElement | null>(null);
    const compositedRef = ref ? compositeRef(elementRef, ref) : elementRef;

    const onExitRef = useRef(__onExited);
    onExitRef.current = __onExited;

    const animationRef = useRef({
        duration,
        onEnter,
        onExit,
    });

    animationRef.current = {
        duration,
        onEnter,
        onExit,
    };

    useEffect(() => {
        const el = elementRef.current;
        const {onEnter, duration} = animationRef.current;
        if (el) {
            const animation = el.animate(onEnter, {
                duration,
                fill: "forwards",
                easing: "cubic-bezier(.05,.74,.3,1.01)",
            });
            return () => animation.cancel();
        }
    }, []);

    useEffect(() => {
        const el = elementRef.current;
        const {onExit, duration} = animationRef.current;
        if (__removed && el) {
            const animation = el.animate(onExit, {
                duration,
                easing: "cubic-bezier(.05,.74,.3,1.01)",
                fill: "forwards",
            });
            animation.onfinish = () => onExitRef.current?.();
            return () => animation.cancel();
        }
    }, [__removed]);

    return (
        <div {...restProps} className={`g-animated ${className ?? ""}`} ref={compositedRef}>
            {children}
        </div>
    );
};

function compositeRef<T>(...refs: Array<React.RefCallback<T> | React.MutableRefObject<T | null>>) {
    return (node: T | null) => {
        refs.forEach(ref => {
            if (typeof ref === "function") {
                ref(node);
            } else {
                ref.current = node;
            }
        });
    };
}
