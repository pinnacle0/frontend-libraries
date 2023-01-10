import {useLocation} from "../../../src";
import {Back} from "../component/Back";

export const GeneralGame = () => {
    const {pathname} = useLocation();
    return (
        <div style={{flex: 1, background: "maroon", color: "#fff"}}>
            <h3>Subtype Page</h3>
            <h3>pathname: {pathname}</h3>
            <Back />
        </div>
    );
};
