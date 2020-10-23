import {colors, dimensions, durations} from "./values";

/* eslint-disable @typescript-eslint/no-use-before-define, react/jsx-fragments, react/jsx-uses-react, react/react-in-jsx-scope -- React 16.14.0 */
declare const React: null;

type UglyImageProps = {style?: React.CSSProperties};

export const UglyImage = ({style}: UglyImageProps) => (
    <Svg viewBoxWidth={dimensions.width} viewBoxHeight={dimensions.height} style={style}>
        <style>{require("bundle-text:./ugly-image.less")}</style>
        <defs>
            <pattern id="bgImg" patternUnits="userSpaceOnUse" width={dimensions.width} height={dimensions.height}>
                <image href={require("data-url:./background.png")} />
            </pattern>
            <linearGradient id="gradientGold">
                <stop offset="0" stopColor={colors.gradientGoldStart} />
                <stop offset="1" stopColor={colors.gradientGoldMid}>
                    <animate attributeName="offset" values=".2;.8;.2" dur={`${durations.animTotal * 2}s`} repeatCount="indefinite" />
                </stop>
                <stop offset="1" stopColor={colors.gradientGoldStart} />
            </linearGradient>
        </defs>
        <rect width="100%" height="100%" fill={colors.background} />
        <rect className="mask-static" />
        <rect className="mask-anim" />
        <ObnoxiousText className="line1" x={dimensions.width / 2} y={dimensions.height * 0.25}>
            Pinnacle
        </ObnoxiousText>
        <ObnoxiousText className="line2" x={dimensions.width / 2} y={dimensions.height * 0.5}>
            Libraries
        </ObnoxiousText>
        <ObnoxiousText className="line3" x={dimensions.width / 2} y={dimensions.height * 0.75}>
            Frontend
        </ObnoxiousText>
        <Doge />
    </Svg>
);

type SvgProps = {viewBoxWidth: number; viewBoxHeight: number; children: React.ReactNode; style?: React.CSSProperties};

const Svg = ({viewBoxWidth, viewBoxHeight, children, style}: SvgProps) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox={`0 0 ${viewBoxWidth} ${viewBoxHeight}`} style={style}>
        {children}
    </svg>
);

type ObnoxiousTextProps = {className: string; x: number; y: number; children: string};

const ObnoxiousText = ({className, x, y, children}: ObnoxiousTextProps) => (
    <>
        <text className={className} x={x} y={y} stroke={colors.textLayer3} strokeWidth={10}>
            {children}
        </text>
        <text className={className} x={x} y={y} stroke={colors.textLayer2} strokeWidth={6}>
            {children}
        </text>
        <text className={className} x={x} y={y} fill="url(#gradientGold)" stroke="url(#gradientGold)" strokeWidth={2}>
            {children}
        </text>
    </>
);

const Doge = () => (
    <g className="doge">
        <g className="doge-look-dir">
            <image href={require("data-url:./doge.png")} />
        </g>
    </g>
);
