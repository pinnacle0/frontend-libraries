import {useLocation} from "@pinnacle0/react-stack-router/src";
import {Back} from "../component/Back";

export const About = () => {
    const {pathname} = useLocation();
    return (
        <div style={{flex: 1, background: "maroon", color: "#fff"}}>
            <h3>About Page</h3>
            <h3>pathname: {pathname}</h3>
            <Back />
        </div>
    );
};
