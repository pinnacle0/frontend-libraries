import {useEffect, useState} from "react";
import {Screen} from "./Screen";
import type {Router, Stack} from "../router";

export function StackRouter({router}: {router: Router}) {
    const [stack, setStack] = useState<Stack[]>([]);

    useEffect(() => {
        return router.listen(_ => setStack([..._]));
    }, [router]);

    return (
        <div className="g-stack-router">
            {stack.map(({param, location, component: Component}) => (
                <Screen key={location.key} param={param} search={location.search} pathname={location.pathname} location={location}>
                    <Component />
                </Screen>
            ))}
        </div>
    );
}
