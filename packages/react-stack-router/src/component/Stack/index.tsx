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
    const [exiting, setExiting] = useState(0);
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
        <div className={classNames("g-stack-router", {exiting: exiting !== 0}, className)} style={style}>
            <AnimatePresence>
                {screens.map((screen, index) => {
                    const context: RouteContext = {location: screen.history.location, lifecycle: screen.lifecycle, params: screen.history.params};
                    return (
                        <Animated.div
                            className={classNames("g-stack-router-screen", {overlay: index > 0})}
                            key={screen.history.location.state.$key}
                            enter={() => screen.transition.enteringKeyframes}
                            exit={() => screen.transition.exitingKeyframes}
                            onEntering={() => screen.lifecycle.trigger("willEnter")}
                            onEntered={() => screen.lifecycle.trigger("didEnter")}
                            onExiting={() => {
                                setExiting(_ => _ + 1);
                                screen.lifecycle.trigger("willExit");
                            }}
                            onExited={() => {
                                setExiting(_ => _ - 1);
                                screen.lifecycle.trigger("didExit");
                            }}
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
