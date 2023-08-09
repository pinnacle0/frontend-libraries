import {useState} from "react";
import {Link, useLocation, useLocationMatch, useParams} from "@pinnacle0/react-stack-router";
import {Back} from "../component/Back";
import {router} from "../router";

export const Game = () => {
    const {pathname} = useLocation();
    const [count, setCount] = useState(0);
    const {id} = useParams<{id?: string}>();

    useLocationMatch(() => {
        console.info("match Game Screen");
    });

    return (
        <div style={{flex: 1, background: "#fff"}}>
            <h3>Game Page</h3>
            <h3>pathname: {pathname}</h3>
            <button onClick={() => setCount(_ => _ + 1)}>count: {count}</button>
            <button onClick={() => router.replaceHash(count.toString())}>change hash to 123</button>
            <h3>{id ? `have id ${id}` : "no id given"}</h3>
            <Back />
            <div>
                <Link to="/game">To Game </Link>
            </div>
            <div>
                <Link to="/game/123" replace>
                    Replace Game with ID 123
                </Link>
            </div>
            <div>
                <Link to="/game/12344" replace>
                    Replace Game with ID 12344
                </Link>
            </div>
            <div>
                <Link to="/about" replace>
                    Replace with About page
                </Link>
            </div>
            <div>
                <button onClick={() => router.push("/game/3333", {transitionType: "none"})}>Push /game/333 with no animation</button>
            </div>
            <div>
                <button
                    onClick={async () => {
                        await router.pop();
                        alert("popped");
                    }}
                >
                    Alert after pop
                </button>
                <button
                    onClick={async () => {
                        await router.pop(2);
                        alert("popped");
                    }}
                >
                    Alert after pop 2 screen
                </button>
            </div>
        </div>
    );
};
