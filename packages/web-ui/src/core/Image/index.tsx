import RcImage from "@rc-component/image";
import React from "react";
import {ReactUtil} from "../../util/ReactUtil";

export interface Props {
    src?: string;
    alt?: string;
    width?: string | number;
    height?: string | number;
    fallback?: string;
    placeholder?: React.ReactNode;
    preview?: boolean | {visible?: boolean; onVisibleChange?: (visible: boolean) => void; src?: string; mask?: React.ReactNode};
    className?: string;
    style?: React.CSSProperties;
    rootClassName?: string;
    crossOrigin?: "anonymous" | "use-credentials";
    loading?: "eager" | "lazy";
    decoding?: "async" | "auto" | "sync";
    onClick?: (e: React.MouseEvent<HTMLDivElement>) => void;
    onError?: (e: React.SyntheticEvent<HTMLImageElement, Event>) => void;
}

const PreviewGroup = RcImage.PreviewGroup;

export const Image = ReactUtil.compound(
    "Image",
    {
        PreviewGroup,
    },
    (props: Props) => {
        return <RcImage {...props} />;
    }
);
