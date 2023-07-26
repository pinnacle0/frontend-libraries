import {useEffect, useState} from "react";
import classNames from "classnames";
import {AnimatePresence, Animated} from "../Animated";
import {RouteContext} from "../../context";
import type {CSSProperties} from "react";
import type {Screen} from "../../screen";
import type {StackRouter} from "../../stackRouter";

interface StackProps {
    router: StackRouter;
    className?: string;
    style?: CSSProperties;
}

export function Stack({router, className, style}: StackProps) {
    const [screens, setScreens] = useState<Screen[]>([]);

    useEffect(() => router.subscribe(_ => setScreens([..._])), [router]);

    return (
        <div className={classNames("g-stack-router", className)} style={style}>
            <AnimatePresence>
                {screens.map(screen => (
                    <Animated.div
                        key={screen.history.location.key}
                        enter={() => screen.transition.enteringKeyframes}
                        exit={() => screen.transition.exitingKeyframes}
                        onEntering={() => screen.lifecycle.trigger("willEnter")}
                        onEntered={() => screen.lifecycle.trigger("didEnter")}
                        onExiting={() => screen.lifecycle.trigger("willExit")}
                        onExited={() => screen.lifecycle.trigger("didExit")}
                    >
                        <RouteContext.Provider value={{location: screen.history.location, lifecycle: screen.lifecycle, params: screen.history.params}}>
                            <screen.content />
                        </RouteContext.Provider>
                    </Animated.div>
                ))}
            </AnimatePresence>
        </div>
    );
}
