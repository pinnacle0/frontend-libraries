import {useDidEnterEffect, useDidExitEffect, useHash, useLocation, useLocationState, useSearchParams, useWillEnterEffect, useWillExitEffect} from "@pinnacle0/react-stack-router";
import {Back} from "../component/Back";
import {useEffect, useState} from "react";
import {router} from "../router";

export const About = () => {
    const {pathname} = useLocation();
    const [hash, setHash] = useHash();
    const [searchParams, setSearchParams] = useSearchParams();
    const [state, setState] = useLocationState<{count: number}>();

    const count = state.count ?? 0;

    // const [count, setCount] = useState(state.count ?? 0);

    requestAnimationFrame(() => {
        document.body.style.backgroundColor = "maroon";
    });

    useWillEnterEffect(() => {
        console.info("about page will enter");
    });

    useDidEnterEffect(() => {
        console.info("about page did enter");
    });

    useWillExitEffect(() => {
        console.info("about page will exit");
    });

    useDidExitEffect(() => {
        console.info("about page did exit");
    });

    return (
        <div style={{flex: 1, background: "maroon", color: "#fff", overscrollBehaviorY: "none", overflow: "hidden"}}>
            <div style={{height: "100%", overflowY: "auto"}}>
                <h3>About Page</h3>
                <Back />
                <h3>pathname: {pathname}</h3>
                <h3>hash: {hash}</h3>
                <h3>search params: {JSON.stringify(searchParams)}</h3>
                <button
                    onClick={() => {
                        setState({count: count + 1});
                    }}>
                    local state count: {count}
                </button>
                <br />
                <button onClick={() => setHash("hash" + Math.random())}>update random Hash</button>
                <button onClick={() => setSearchParams({a: "123"})}>update search params</button>
                <button onClick={() => router.popAll()}>Pop All</button>
                <div className="box" />
                <div className="box" />
                <div className="box" />
                <div className="box" />
                <div className="box" />
                <div className="box" />
                <div className="box" />
                <div className="box" />
                <div className="box" />
                <div className="box" />
                <div className="box" />
                <p>End</p>
            </div>
        </div>
    );
};
