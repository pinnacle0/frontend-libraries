import {useDidEnterEffect, useDidExitEffect, useHash, useLocation, useNavigate, useWillEnterEffect, useWillExitEffect} from "@pinnacle0/react-stack-router";
import {Back} from "../component/Back";

export const About = () => {
    const {pathname} = useLocation();
    const [hash, setHash] = useHash();

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
                <button onClick={() => setHash("hash" + Math.random())}>Change Hash</button>
                <h3>pathname: {pathname}</h3>
                <h3>hash: {hash}</h3>
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
