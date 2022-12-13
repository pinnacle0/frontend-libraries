import "../internal/polyfill/IntersectionObserver";
import React, {useEffect} from "react";

export const useInView = () => {
    const [isInView, setIsInView] = React.useState(false);

    const updateRef = {};

    useEffect(() => {
        const observer = new IntersectionObserver(() => {}, {});
    }, []);

    return;
};
