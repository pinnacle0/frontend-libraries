import {Link} from "@pinnacle0/react-stack-router/src";
import {Back} from "../component/Back";

export const About = () => {
    return (
        <div style={{flex: 1, background: "maroon"}}>
            <h3>About Page</h3>
            <Back />
            <Link to="/">Push Home</Link>
        </div>
    );
};
