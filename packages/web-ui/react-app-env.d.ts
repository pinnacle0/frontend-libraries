declare module "*.gif" {
    const src: string;
    export default src;
}

declare module "*.jpg" {
    const src: string;
    export default src;
}

declare module "*.jpeg" {
    const src: string;
    export default src;
}

declare module "*.png" {
    const src: string;
    export default src;
}

declare module "*.svg" {
    import type * as React from "react";

    export const ReactComponent: React.FunctionComponent<React.SVGProps<SVGSVGElement> & {title?: string}>;

    const src: string;
    export default src;
}

declare module "*.mp3" {
    const src: string;
    export default src;
}

declare module "*.rar" {
    const src: string;
    export default src;
}

declare module "*.less" {}
declare module "*.css" {}
