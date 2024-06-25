import React from "react";
import {Amount} from "@pinnacle0/web-ui/core/Amount";
import type {DemoHelperGroupConfig} from "../DemoHelper";
import {DemoHelper} from "../DemoHelper";

const groups: DemoHelperGroupConfig[] = [
    {
        title: "Basic",
        components: [
            <Amount value={null} scale={2} />,
            <Amount value={0} scale={2} />,
            <Amount value={10} scale={2} />,
            <Amount value={9999} scale={2} />,
            <Amount value={999999999} scale={2} />,
            <Amount value={999999999} scale={10} />,
        ],
    },
    {
        title: "Flooring",
        components: [
            <Amount value={999999999.678} scale={0} />,
            <Amount value={999999999.678} scale={0} rounding="floor" />,
            <Amount value={999999999.678} scale={0} rounding="ceil" />,
            "-",
            <Amount value={999999999.678} scale={1} />,
            <Amount value={999999999.678} scale={1} rounding="floor" />,
            <Amount value={999999999.678} scale={1} rounding="ceil" />,
            "-",
            <Amount value={999999999.678} scale={2} />,
            <Amount value={999999999.678} scale={2} rounding="floor" />,
            <Amount value={999999999.678} scale={2} rounding="ceil" />,
            "-",
            <Amount value={999999999.678} scale={3} />,
            <Amount value={999999999.678} scale={3} rounding="floor" />,
            <Amount value={999999999.678} scale={3} rounding="ceil" />,
            "-",
            <Amount value={999999999.678} scale={4} />,
            <Amount value={999999999.678} scale={4} rounding="floor" />,
            <Amount value={999999999.678} scale={4} rounding="ceil" />,
        ],
    },
    {
        title: "Coloring",
        components: [
            <Amount value={9999} scale={1} colorScheme="green+red-" />,
            <Amount value={0} scale={1} colorScheme="green+red-" />,
            <Amount value={-9999} scale={1} colorScheme="green+red-" />,
            "-",
            <Amount value={9999} scale={1} colorScheme="green-red+" />,
            <Amount value={0} scale={1} colorScheme="green-red+" />,
            <Amount value={-9999} scale={1} colorScheme="green-red+" />,
            "-",
            <Amount value={9999} scale={3} colorScheme="highlight" />,
            <Amount value={-9999} scale={3} colorScheme="highlight" />,
        ],
    },
    {
        title: "Decoration",
        components: [
            <Amount value={6789.23} scale={3} del />,
            <Amount value={6789.23} scale={3} underline />,
            <Amount value={6789.23} scale={3} bold />,
            <Amount value={6789.23} scale={3} plusSignForPositive />,
            <Amount value={6789.23} scale={3} thousandSplitter={false} />,
        ],
    },
    {
        title: "Postfix/Prefix",
        components: [
            <Amount value={6789.23} scale={3} prefix=">>" postfix="<<" />,
            <Amount value={6789.23} scale={3} prefix=">>" postfix="<<" colorScheme="highlight" />,
            <Amount value={6789.23} scale={3} prefix=">>" />,
            <Amount value={6789.23} scale={3} del underline bold postfix="<<" />,
        ],
    },
    {
        title: "Percentage",
        components: [
            <Amount.Percentage value={0.5} percentageScale={2} />,
            <Amount.Percentage value={0.6} percentageScale={0} />,
            <Amount.Percentage value={0} percentageScale={3} />,
            <Amount.Percentage value={-1.2} percentageScale={1} colorScheme="green+red-" />,
        ],
    },
    {
        title: "With Surrounding Text",
        components: [
            <div>
                test
                <Amount value={6789.23} scale={3} del underline bold prefix=">>" postfix="<<" />
                test
            </div>,
            <span>
                test
                <Amount value={6789.23} scale={3} del underline bold prefix=">>" postfix="<<" />
                test
            </span>,
            <div>
                <span>test </span>
                <Amount value={6789.23} scale={3} del underline bold prefix=">>" postfix="<<" />
                test
            </div>,
            <div>
                test
                <Amount value={6789.23} scale={3} del underline bold prefix=">>" postfix="<<" />
                test
            </div>,
            <div>
                <span style={{fontSize: 30}}>test</span>
                <Amount value={6789.23} scale={3} del underline bold prefix=">>" postfix="<<" />
                <span style={{fontSize: 10}}>test</span>
            </div>,
        ],
    },
];

export const AmountDemo = () => <DemoHelper groups={groups} />;
