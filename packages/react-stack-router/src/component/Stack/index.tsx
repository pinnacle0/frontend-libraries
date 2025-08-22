import {useEffect, useLayoutEffect, useState} from "react";
import classNames from "classnames";
import {AnimatePresence, Animated} from "../Animated";
import {RouteContext} from "../../context";
import type {CSSProperties} from "react";
import type {Screen} from "../../screen";
import type {StackRouter} from "../../stackRouter";
import "./index.less";

interface StackProps {
    router: StackRouter;
    className?: string;
    style?: CSSProperties;
}

export function Stack({router, className, style}: StackProps) {
    const [screens, setScreens] = useState<Screen[]>([]);
    useEffect(() => router.subscribe(_ => setScreens([..._])), [router]);

    useLayoutEffect(() => {
        if (screens.length > 1) {
            const original = document.body.style.overflowY;
            document.body.style.overflowY = "hidden";
            return () => {
                document.body.style.overflowY = original;
            };
        }
    }, [screens]);

    return (
        <div className={classNames("g-stack-router", className)} style={style}>
            <AnimatePresence>
                {screens.map((screen, index) => {
                    const context: RouteContext = {
                        location: screen.location,
                        lifecycle: screen.lifecycle,
                        params: screen.params,
                        searchParams: screen.searchParams,
                    };

                    return (
                        <Animated.div
                            className={classNames("g-stack-router-screen", {overlay: index > 0})}
                            style={
                                index === screens.length - 2
                                    ? {transform: "translate3d(-100px, 0, 0)"}
                                    : index === screens.length - 1 && router.isSafariEdgeSwipeBackwardPop()
                                      ? {transition: "none"}
                                      : undefined
                            }
                            key={screen.location.key}
                            enter={() => screen.transition.enteringKeyframes}
                            exit={() => screen.transition.exitingKeyframes}
                            onEntering={() => screen.lifecycle.trigger("willEnter")}
                            onEntered={() => screen.lifecycle.trigger("didEnter")}
                            onExiting={() => screen.lifecycle.trigger("willExit")}
                            onExited={() => screen.lifecycle.trigger("didExit")}
                        >
                            <RouteContext.Provider value={context}>
                                <screen.content {...context} />
                            </RouteContext.Provider>
                        </Animated.div>
                    );
                })}
            </AnimatePresence>
        </div>
    );
}
