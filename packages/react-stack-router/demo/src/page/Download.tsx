import {Back} from "../component/Back";

export const Download = () => {
    return (
        <div style={{flex: 1, backgroundColor: "plum", color: "#fff"}}>
            <h1>Download</h1>
            <p>Should only load Download page when reload</p>
            <Back />
        </div>
    );
};
