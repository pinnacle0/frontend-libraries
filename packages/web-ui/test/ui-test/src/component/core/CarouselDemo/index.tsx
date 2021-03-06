import React from "react";
import {Carousel3D} from "@pinnacle0/web-ui/core/Carousel3D";
import {Carousel} from "@pinnacle0/web-ui/core/Carousel";
import {generateDummyURLs} from "../../../dummy/dummyList";
import type {DemoHelperGroupConfig} from "../../DemoHelper";
import {DemoHelper} from "../../DemoHelper";

const groups: DemoHelperGroupConfig[] = [
    {
        title: "Carousel3D",
        showPropsHint: false,
        components: [
            <div style={{width: 600, overflow: "hidden"}}>
                <Carousel3D>
                    {generateDummyURLs(1).map(img => {
                        return <img key={img} src={img} />;
                    })}
                </Carousel3D>
            </div>,
            <div style={{width: 600, overflow: "hidden"}}>
                <Carousel3D>
                    {generateDummyURLs(2).map(img => {
                        return <img key={img} src={img} />;
                    })}
                </Carousel3D>
            </div>,
            <div style={{width: 600, overflow: "hidden"}}>
                <Carousel3D>
                    {generateDummyURLs(3).map(img => {
                        return <img key={img} src={img} />;
                    })}
                </Carousel3D>
            </div>,
        ],
    },
    {
        title: "Carousel",
        showPropsHint: false,
        components: [
            <div style={{width: 600, overflow: "hidden"}}>
                <Carousel>
                    {generateDummyURLs(3).map(img => {
                        return <img key={img} src={img} />;
                    })}
                </Carousel>
            </div>,
        ],
    },
];

export const CarouselDemo = () => <DemoHelper groups={groups} />;
