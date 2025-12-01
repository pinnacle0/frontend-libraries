import React from "react";
import "./index.less";
import {ReactUtil} from "../../util/ReactUtil";
import {useDidMountEffect} from "../../hooks/useDidMountEffect";
import {useWillUnmountEffect} from "../../hooks/useWillUnmountEffect";

interface Props {
    children: React.ReactElement[];
}

const AUTO_PLAY_INTERVAL = 3000;

export const Carousel3D = ReactUtil.memo("Carousel3D", ({children}: Props) => {
    const [current, setCurrent] = React.useState(0); // Range: [-1, children.length], 1st & last are cloned
    const isTimerComplete = React.useRef(false);
    const isChildTransition = React.useRef(true);
    const timer = React.useRef<NodeJS.Timeout | undefined>(undefined);

    useDidMountEffect(() => {
        startAnimation();
    });

    useWillUnmountEffect(() => {
        clearTimeout(timer.current);
    });

    React.useEffect(() => {
        if (current === React.Children.count(children)) {
            isChildTransition.current = false;
        } else {
            isChildTransition.current = true;
        }
        isTimerComplete.current = false;
    }, [children, current]);

    const jumpToPrevSlide = () => {
        clearTimeout(timer.current);
        setCurrent(prev => (prev === 0 ? React.Children.count(children) - 1 : prev - 1));
        isTimerComplete.current = true;
    };

    const jumpToNextSlide = () => {
        clearTimeout(timer.current);
        setCurrent(prev => (prev === React.Children.count(children) ? 0 : prev + 1));
        isTimerComplete.current = true;
    };

    const jumpToSlide = (index: number) => {
        clearTimeout(timer.current);
        setCurrent(index);
        isTimerComplete.current = true;
    };

    const startAnimation = () => {
        if (isTimerComplete.current) return;

        isTimerComplete.current = true;
        if (current === React.Children.count(children)) {
            setCurrent(0);
        } else {
            timer.current = setTimeout(() => setCurrent(prev => prev + 1), AUTO_PLAY_INTERVAL);
        }
    };

    const handleMouseEnter = () => {
        clearTimeout(timer.current);
        isTimerComplete.current = true;
    };

    const handleMouseLeave = () => {
        clearTimeout(timer.current);
        isTimerComplete.current = false;
        startAnimation();
    };

    const childrenLength = React.Children.count(children);
    if (childrenLength <= 1) {
        return (
            <div className="g-carousel-3d">
                <div className="child-slide active">{children}</div>
            </div>
        );
    } else {
        return (
            <div className={`g-carousel-3d ${isChildTransition.current ? "has-transition" : ""}`} onTransitionEnd={startAnimation}>
                <div className={`child-slide child-clone ${current === -1 ? "pre" : ""}`}>{children[childrenLength - 2]}</div>
                <div className={`child-slide child-clone ${current === -1 ? "active" : ""} ${current === 0 ? "pre" : ""} `}>{children[childrenLength - 1]}</div>
                {React.Children.map(children, (child, key) => (
                    <div
                        key={key}
                        className={`child-slide ${current === key - 1 ? "next" : current === key ? "active" : current === key + 1 ? "pre" : ""}`}
                        onMouseEnter={() => current === key && handleMouseEnter()}
                        onMouseLeave={() => current === key && handleMouseLeave()}
                    >
                        {child}
                        <div className="arrow arrow-left" onClick={jumpToPrevSlide}>
                            <svg width="40px" height="44px" viewBox="0 0 40 44" version="1.1">
                                <g stroke="none" strokeWidth="1" fill="none" fillRule="evenodd" opacity="0.300000012">
                                    <g transform="translate(-80.000000, -133.000000)" fill="#000000">
                                        <g transform="translate(80.000000, 133.000000)">
                                            <path d="M38,-1.42108547e-14 C39.1045695,-1.44137608e-14 40,0.8954305 40,2 L40,41.1428571 C40,42.2474266 39.1045695,43.1428571 38,43.1428571 L2,43.1428571 C0.8954305,43.1428571 1.3527075e-16,42.2474266 0,41.1428571 L0,2 C-1.3527075e-16,0.8954305 0.8954305,-1.40079486e-14 2,-1.42108547e-14 L38,-1.42108547e-14 Z M22.2974465,7.582202 L11.3775647,19.7056672 C10.5306088,20.6475229 10.5306088,22.1746071 11.3775647,23.1145987 L22.2974465,35.2376129 C23.146744,36.1794687 24.5218276,36.1794687 25.3693131,35.2376129 C26.2181367,34.2971102 26.2181367,32.7703567 25.3693131,31.8282905 L15.984835,21.4100879 L25.3693131,10.9930879 C26.2181088,10.0512322 26.2181088,8.52441857 25.3693131,7.58208173 C24.5219391,6.64203 23.1469112,6.64203 22.2974465,7.582202 Z" />
                                        </g>
                                    </g>
                                </g>
                            </svg>
                        </div>
                        <div className="arrow arrow-right" onClick={jumpToNextSlide}>
                            <svg width="40px" height="44px" viewBox="0 0 40 44" version="1.1">
                                <g stroke="none" strokeWidth="1" fill="none" fillRule="evenodd" opacity="0.300000012">
                                    <g transform="translate(-1240.000000, -133.000000)" fill="#000000">
                                        <g transform="translate(1240.000000, 133.000000)">
                                            <path
                                                d="M38,-1.42108547e-14 C39.1045695,-1.44137608e-14 40,0.8954305 40,2 L40,41.1428571 C40,42.2474266 39.1045695,43.1428571 38,43.1428571 L2,43.1428571 C0.8954305,43.1428571 1.3527075e-16,42.2474266 0,41.1428571 L0,2 C-1.3527075e-16,0.8954305 0.8954305,-1.40079486e-14 2,-1.42108547e-14 L38,-1.42108547e-14 Z M22.2974465,7.582202 L11.3775647,19.7056672 C10.5306088,20.6475229 10.5306088,22.1746071 11.3775647,23.1145987 L22.2974465,35.2376129 C23.146744,36.1794687 24.5218276,36.1794687 25.3693131,35.2376129 C26.2181367,34.2971102 26.2181367,32.7703567 25.3693131,31.8282905 L15.984835,21.4100879 L25.3693131,10.9930879 C26.2181088,10.0512322 26.2181088,8.52441857 25.3693131,7.58208173 C24.5219391,6.64203 23.1469112,6.64203 22.2974465,7.582202 Z"
                                                transform="translate(20.000000, 21.571429) scale(-1, 1) translate(-20.000000, -21.571429) "
                                            />
                                        </g>
                                    </g>
                                </g>
                            </svg>
                        </div>
                    </div>
                ))}
                <div className={`child-slide child-clone ${current === childrenLength ? "active" : ""} ${current === childrenLength - 1 ? "next" : ""}`}>{children[0]}</div>
                <div className={`child-slide child-clone ${current === childrenLength ? "next" : ""}`}>{children[1]}</div>
                <div className="pagination">
                    {React.Children.map(children, (_, key) => (
                        <div key={key} className={current % childrenLength === key ? "active" : ""} onClick={() => jumpToSlide(key)} onMouseEnter={() => current === key && handleMouseEnter()} />
                    ))}
                </div>
            </div>
        );
    }
});
