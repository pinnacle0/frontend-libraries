import {useState} from "react";
import {Link, useLocation, useLocationMatch, useNavigate} from "@pinnacle0/react-stack-router";
import {router} from "../router";
import {Back} from "../component/Back";

export const Home = () => {
    const [count, setCount] = useState(0);
    const {pathname} = useLocation();
    const {push, popAll} = useNavigate();

    useLocationMatch(() => {
        console.info("match Home Screen");
    });

    requestAnimationFrame(() => {
        document.body.style.backgroundColor = "teal";
    });

    return (
        <div style={{flex: 1, background: "teal"}}>
            <h3>Home Page</h3>
            <Back />
            <div style={{display: "flex", flexFlow: "row"}}>
                <p>Count: {count}</p>
                <button style={{marginLeft: 30}} onClick={() => setCount(_ => _ + 1)}>
                    +
                </button>
            </div>

            <p>pathname: {pathname}</p>
            <Link to="/about">Go To About using Link</Link>
            <div>
                <button onClick={() => router.push("/not-found")}>to Not Found </button>
                <button onClick={() => router.push("/about")}>Push /about using router.push()</button>
                <button onClick={() => router.push("/")}>Push / using router.push</button>
                <button onClick={() => push("/game")}>Push /game using useNavigate()</button>
                <button onClick={() => push("/game/3")}>Push /game/3 using useNavigate()</button>
                <button onClick={() => push("/game/3")}>Push /game/3 using useNavigate()</button>
                <button
                    onClick={async () => {
                        console.info("before enter");
                        await push("/game/123");
                        await push("/game/456");
                        await push("/game/7809");
                        console.info("after enter");
                    }}
                >
                    Push multiple game/:id using useNavigate() with async
                </button>
                <button onClick={popAll}>Pop All</button>
            </div>
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
    );
};
