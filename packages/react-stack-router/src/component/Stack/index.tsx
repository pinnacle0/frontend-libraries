import {useEffect, useState} from "react";
import type {CSSProperties} from "react";
import classNames from "classnames";
import {AnimatePresence, Animated} from "../Animated";
import type {Screen} from "../../screen";
import type {StackRouter} from "../../stackRouter";
import {RouteContext} from "../../context";

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
                        enter={() => ({
                            frames: screen.transition.enteringKeyframes ?? [],
                            options: {duration: 10000, easing: "cubic-bezier(.05,.74,.3,1.01)", fill: "forwards"},
                        })}
                        key={screen.history.location.key}
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
