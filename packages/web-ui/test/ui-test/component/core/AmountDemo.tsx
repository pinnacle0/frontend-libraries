import React from "react";
import {Amount} from "@pinnacle0/web-ui/core/Amount";
import {DemoHelper, DemoHelperGroupConfig} from "../DemoHelper";

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
            <Amount value={999999999.678} scale={0} floorRounding />,
            "-",
            <Amount value={999999999.678} scale={1} />,
            <Amount value={999999999.678} scale={1} floorRounding />,
            "-",
            <Amount value={999999999.678} scale={2} />,
            <Amount value={999999999.678} scale={2} floorRounding />,
            "-",
            <Amount value={999999999.678} scale={3} />,
            <Amount value={999999999.678} scale={3} floorRounding />,
            "-",
            <Amount value={999999999.678} scale={4} />,
            <Amount value={999999999.678} scale={4} floorRounding />,
        ],
    },
    {
        title: "Coloring",
        components: [
            <Amount value={9999} scale={1} colorScheme="green-red" />,
            <Amount value={0} scale={1} colorScheme="green-red" />,
            <Amount value={-9999} scale={1} colorScheme="green-red" />,
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
            <Amount value={6789.23} scale={3} withPlusSignForPositive />,
            <Amount value={6789.23} scale={3} withThousandSplitter={false} />,
        ],
    },
    {
        title: "Postfix/Prefix",
        components: [
            <Amount value={6789.23} scale={3} prefix=">>" postfix="<<" />,
            <Amount value={6789.23} scale={3} prefix=">>" postfix="<<" colorScheme="highlight" />,
            <Amount value={6789.23} scale={3} prefix=">>" />,
            <Amount value={6789.23} scale={3} postfix="<<" />,
        ],
    },
    {
        title: "Percentage",
        components: [
            <Amount.Percentage value={0.5} percentageScale={2} />,
            <Amount.Percentage value={0.6} percentageScale={0} />,
            <Amount.Percentage value={0} percentageScale={3} />,
            <Amount.Percentage value={-1.2} percentageScale={1} colorScheme="green-red" />,
        ],
    },
];

export const AmountDemo = () => <DemoHelper groups={groups} />;
