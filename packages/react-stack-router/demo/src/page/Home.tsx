import {useState} from "react";
import {Link, useLocation} from "@pinnacle0/react-stack-router/src";
import {router} from "../router";
import {Back} from "../component/Back";

export const Home = () => {
    const [count, setCount] = useState(0);
    const {pathname} = useLocation();

    return (
        <div style={{flex: 1, background: "teal"}}>
            <h3>Home Page</h3>
            <Back />
            <h5>Counter</h5>
            <p>Count: {count}</p>
            <button onClick={() => setCount(_ => _ + 1)}>+</button>
            <p>pathname: {pathname}</p>

            <button onClick={() => router.push("/game")}>Push /game using router.push</button>
            <p>
                <Link to="/about">Go To About</Link>
            </p>
            <div className="box" />
            <div className="box" />
            <div className="box" />
            <div className="box" />
        </div>
    );
};
