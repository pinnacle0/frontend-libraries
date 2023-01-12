import {useEffect, useState} from "react";
import {AnimatePresence} from "../AnimationPresence";
import {ScreenComponent} from "./ScreenComponent";
import type {StackRouter} from "../../stackRouter";
import "./index.less";
import classNames from "classnames";
import type {Screen} from "../../stackRouter/screen";

interface StackProps {
    router: StackRouter;
    className?: string;
}

export function Stack({router, className}: StackProps) {
    const [screens, setScreens] = useState<Screen[]>([]);
    useEffect(() => router.subscribe(_ => setScreens([..._])), [router]);

    useEffect(() => router.attachSafariEdgeSwipeDetector(), [router]);

    return (
        <div className={classNames("g-stack-router", className)}>
            <AnimatePresence>
                {screens.map(screen => (
                    <ScreenComponent className="g-stack-router-screen" key={screen.history.location.key} screen={screen} />
                ))}
            </AnimatePresence>
        </div>
    );
}
