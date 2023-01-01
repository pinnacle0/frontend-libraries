import React, {useEffect, useRef} from "react";

interface Props extends React.DetailedHTMLProps<React.HtmlHTMLAttributes<HTMLDivElement>, HTMLDivElement> {
    ref?: React.MutableRefObject<HTMLDivElement> | React.RefCallback<HTMLDivElement>;
    onEnter: Keyframe[] | PropertyIndexedKeyframes | null;
    onExit: Keyframe[] | PropertyIndexedKeyframes | null;
    duration?: number;
}

export const Motion = (props: Props) => {
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

    const durationRef = useRef(duration);
    durationRef.current = duration;

    const onEnterRef = useRef(onEnter);
    onEnterRef.current = onEnter;

    const onExitRef = useRef(onExit);
    onExitRef.current = onExit;

    const onAnimationEndRef = useRef(__onExited);
    onAnimationEndRef.current = __onExited;

    useEffect(() => {
        const el = elementRef.current;
        if (el) {
            const animation = el.animate(onEnterRef.current, {
                duration: durationRef.current,
                fill: "forwards",
                easing: "cubic-bezier(.05,.74,.3,1.01)",
            });
            return () => animation.cancel();
        }
    }, []);

    useEffect(() => {
        const el = elementRef.current;
        if (__removed && el) {
            const animation = el.animate(onExitRef.current, {
                duration: durationRef.current,
                easing: "cubic-bezier(.05,.74,.3,1.01)",
                fill: "forwards",
            });
            animation.onfinish = () => onAnimationEndRef.current?.();
            return () => animation.cancel();
        }
    }, [__removed]);

    return (
        <div {...restProps} className={`g-motion ${className ?? ""}`} ref={compositedRef}>
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
