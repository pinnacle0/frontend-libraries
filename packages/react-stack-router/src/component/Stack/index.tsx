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
                    const context: RouteContext = {location: screen.history.location, lifecycle: screen.lifecycle, params: screen.history.params};
                    console.log(screen.history.location.state.$key);
                    return (
                        <Animated.div
                            className={classNames("g-stack-router-screen", {overlay: index > 0})}
                            key={screen.history.location.state.$key}
                            enter={() => screen.transition.enteringKeyframes}
                            exit={() => screen.transition.exitingKeyframes}
                            onEntering={() => screen.lifecycle.trigger("willEnter")}
                            onEntered={() => screen.lifecycle.trigger("didEnter")}
                            onExiting={() => screen.lifecycle.trigger("willExit")}
                            onExited={() => screen.lifecycle.trigger("didExit")}
                        >
                            <RouteContext.Provider value={context}>
                                <screen.content />
                            </RouteContext.Provider>
                        </Animated.div>
                    );
                })}
            </AnimatePresence>
        </div>
    );
}
