import {useDidEnterEffect, useDidExitEffect, useHash, useLocation, useLocationState, useSearchParams, useWillEnterEffect, useWillExitEffect} from "@pinnacle0/react-stack-router";
import {Back} from "../component/Back";
import {useEffect, useState} from "react";

export const About = () => {
    const {pathname} = useLocation();
    const [hash, setHash] = useHash();
    const [searchParams, setSearchParams] = useSearchParams();
    const [state, setState] = useLocationState<{count: number}>();

    const [count, setCount] = useState(0);

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

    useEffect(() => {
        setState({count});
    }, [count, setState]);

    return (
        <div style={{flex: 1, background: "maroon", color: "#fff", overscrollBehaviorY: "none", overflow: "hidden"}}>
            <div style={{height: "100%", overflowY: "auto"}}>
                <h3>About Page</h3>
                <Back />
                <h3>pathname: {pathname}</h3>
                <h3>hash: {hash}</h3>
                <h3>search params: {JSON.stringify(searchParams)}</h3>
                <h3>location state: {state.count}</h3>
                <button
                    onClick={() => {
                        setCount(count + 1);
                    }}
                >
                    count: {count}
                </button>
                <br />
                <button onClick={() => setHash("hash" + Math.random())}>update random Hash</button>
                <button onClick={() => setSearchParams({a: "123"})}>update search params</button>
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
