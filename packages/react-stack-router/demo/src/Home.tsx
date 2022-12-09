import {useState} from "react";
import {Link} from "../../src";

export const Home = () => {
    const [count, setCount] = useState(0);
    return (
        <div style={{flex: 1, background: "teal"}}>
            <h3>Home Page</h3>
            <p>Count: {count}</p>
            <button onClick={() => setCount(_ => _ + 1)}>+</button>
            <p>
                <Link style={{position: "fixed", top: 0, right: 0}} to="/about">
                    Go To About
                </Link>
            </p>
            <div className="box" />
            <div className="box" />
            <div className="box" />
            <div className="box" />
            <div className="box" />
            <div className="box" />
            <div className="box" />
            <div className="box" />
            <div className="box" />
        </div>
    );
};
