import React from "react";
import {router} from "../router";

export const Back = () => {
    return <button onClick={() => router.pop()}>Back</button>;
};
