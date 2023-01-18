import {Link, useLocation, useParams} from "@pinnacle0/react-stack-router/src";
import {Back} from "../component/Back";
import {router} from "../router";

export const Game = () => {
    const {pathname} = useLocation();
    const {id} = useParams<{id?: string}>();

    return (
        <div style={{flex: 1, background: "#fff"}}>
            <h3>Game Page</h3>
            <h3>pathname: {pathname}</h3>
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
                <button onClick={() => router.push("/game/3333", {transition: "none"})}>Push with no animation</button>
            </div>
            <div>
                <button
                    onClick={async () => {
                        await router.pop();
                        alert("popped");
                    }}
                >
                    Pop with async
                </button>
            </div>
            <div>
                <button
                    onClick={async () => {
                        await router.replace("/game/replaced");
                        alert("replaced");
                    }}
                >
                    Replace with async
                </button>
            </div>
        </div>
    );
};
