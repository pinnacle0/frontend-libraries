import React from "react";
import {ReactUtil} from "../../util/ReactUtil";

interface Props {
    digit: string;
}

export const SlidingDigit = ReactUtil.memo("SlidingDigit", ({digit}: Props) => {
    const [currentDigit, setCurrentDigit] = React.useState(digit);
    const [withSlidedClass, setWithSlidedClass] = React.useState(false);

    React.useEffect(() => {
        setWithSlidedClass(true);
    }, [digit]);

    const handleTransitionEnd = () => {
        setCurrentDigit(digit);
        setWithSlidedClass(false);
    };

    return (
        <div className="sliding-digit-outer">
            <div onTransitionEnd={handleTransitionEnd} className={`sliding-digit-inner ${withSlidedClass ? "slided" : ""}`}>
                <p>{digit}</p>
                <p>{currentDigit}</p>
            </div>
        </div>
    );
});
