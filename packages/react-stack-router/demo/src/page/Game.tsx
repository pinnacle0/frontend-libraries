import {Link, useLocation, useParam} from "@pinnacle0/react-stack-router/src";
import {Back} from "../component/Back";

export const Game = () => {
    const {pathname} = useLocation();
    const {id} = useParam<{id?: string}>();

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
        </div>
    );
};
