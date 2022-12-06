import {useState, useMemo, useEffect} from "react";
import {Router} from "../router";
import type React from "react";
import type {History} from "history";
import type {Route} from "../route";
import type {Stack} from "../router";

export interface RouterHookResult extends Pick<Router, "push" | "pop" | "replace" | "reset"> {
    stack: Readonly<Stack[]>;
}

export const useRouter = (route: Route<React.ComponentType<any>>, history: History): RouterHookResult => {
    // eslint-disable-next-line react-hooks/exhaustive-deps -- only happen in first render
    const router = useMemo(() => new Router(route, history), []);
    router.update(route, history);

    const [stack, setStack] = useState<Stack[]>(router.getStack());

    // force update since new stack from the listener is same reference
    useEffect(() => router.listen(stack => setStack([...stack])), [router]);

    return {
        stack,
        push: router.push.bind(router),
        pop: router.pop.bind(router),
        replace: router.replace.bind(router),
        reset: router.reset.bind(router),
    };
};
