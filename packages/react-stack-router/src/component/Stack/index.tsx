import {useEffect, useLayoutEffect, useState} from "react";
import classNames from "classnames";
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
            {screens.map((screen, index) => {
                const context: RouteContext = {
                    location: screen.location,
                    params: screen.params,
                    searchParams: screen.searchParams,
                };

                return (
                    <div className={classNames("g-stack-router-screen", index === screens.length - 1 ? router.transitionType : undefined, {overlay: index > 0})} key={screen.location.key}>
                        <RouteContext.Provider value={context}>
                            <screen.content {...context} />
                        </RouteContext.Provider>
                    </div>
                );
            })}
        </div>
    );
}
