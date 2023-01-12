import {useDidEnterEffect, useDidExitEffect, useLocation, useWillEnterEffect, useWillExitEffect} from "@pinnacle0/react-stack-router/src";
import {Back} from "../component/Back";

export const About = () => {
    const {pathname} = useLocation();

    useWillEnterEffect(() => {
        console.info("page will enter");
    });

    useDidEnterEffect(() => {
        console.info("page did enter");
    });

    useWillExitEffect(() => {
        console.info("page will exit");
    });

    useDidExitEffect(() => {
        console.info("page did exit");
    });

    return (
        <div style={{flex: 1, background: "maroon", color: "#fff"}}>
            <h3>About Page</h3>
            <Back />
            <h3>pathname: {pathname}</h3>
        </div>
    );
};
