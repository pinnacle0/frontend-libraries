import {useEffect, useState} from "react";
import type {CSSProperties} from "react";
import classNames from "classnames";
import {AnimatePresence} from "../AnimationPresence";
import {ScreenComponent} from "./ScreenComponent";
import type {Screen} from "../../screen";
import type {StackRouter} from "../../stackRouter";

interface StackProps {
    router: StackRouter;
    className?: string;
    style?: CSSProperties;
}

const routerStyle: CSSProperties = {
    position: "relative",
    display: "flex",
    flex: 1,
};

const screenStyle: CSSProperties = {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    display: "flex",
    touchAction: "none",
    flexFlow: "column nowrap",
    boxShadow: "3px 0 5px 5px rgba(0 0 0 / 10%)",
};

export function Stack({router, className, style}: StackProps) {
    const [screens, setScreens] = useState<Screen[]>([]);

    useEffect(() => router.subscribe(_ => setScreens([..._])), [router]);

    return (
        <div className={classNames("g-stack-router", className)} style={{...style, ...routerStyle}}>
            <AnimatePresence>
                {screens.map(screen => (
                    <ScreenComponent className="g-stack-router-screen" style={screenStyle} key={screen.history.location.key} screen={screen} />
                ))}
            </AnimatePresence>
        </div>
    );
}
