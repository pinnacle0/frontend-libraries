import {router} from "../router";

export const Back = () => {
    return (
        <button style={{marginBottom: 30}} onClick={() => router.pop()}>
            Back
        </button>
    );
};
