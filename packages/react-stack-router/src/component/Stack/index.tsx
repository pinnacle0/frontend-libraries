import {useEffect, useState} from "react";
import {AnimatePresence} from "../AnimationPresence";
import {RouteContext} from "../../context";
import {Screen} from "../Screen";
import type {StackRouter, ScreenData} from "../../StackRouter";
import "./index.less";

export function Stack({router}: {router: StackRouter}) {
    const [screens, setScreens] = useState<ScreenData[]>([]);

    useEffect(() => {
        return router.subscribe(_ => setScreens([..._]));
    }, [router]);

    return (
        <div className="g-stack-router">
            <AnimatePresence>
                {screens.map(({param, location, component: Component, transition}) => (
                    <Screen className="g-stack-router-screen" key={location.key} duration={450} onEnter={() => transition.getEnteringKeyframes()} onExit={() => transition.getExitingKeyframes()}>
                        <RouteContext.Provider value={{param, location}}>
                            <Component />
                        </RouteContext.Provider>
                    </Screen>
                ))}
            </AnimatePresence>
        </div>
    );
}
