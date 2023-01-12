import {useState} from "react";
import {Link, useLocation, useNavigate} from "@pinnacle0/react-stack-router/src";
import {router} from "../router";
import {Back} from "../component/Back";

export const Home = () => {
    const [count, setCount] = useState(0);
    const {pathname} = useLocation();
    const {push} = useNavigate();

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
                <button onClick={() => push("/game")}>Push /game using useNavigate()</button>
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
                    Push /game/3 using useNavigate() with async
                </button>
            </div>
        </div>
    );
};
