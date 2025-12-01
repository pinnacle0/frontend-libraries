import React from "react";
import {ReactUtil} from "../../util/ReactUtil";
import {useWillUnmountEffect} from "../../hooks/useWillUnmountEffect";

/**
 * <DocumentTitle> will set the document.title as one of following:
 *      {baseTitle}
 *      {baseTitle} {separator} {pageTitle}
 * According to latest <DocumentTitle> element.
 */
export interface Props {
    title?: string | null;
    children: React.ReactNode;
}

interface BaseOption {
    baseTitle: string;
    separator: string;
}

const baseOption: BaseOption = {
    baseTitle: "<Document Title Unset>",
    separator: "-",
};

const DocumentTitle = ReactUtil.memo("DocumentTitle", ({title, children}: Props) => {
    const prevTitle = React.useRef(document.title);

    React.useEffect(() => {
        const {baseTitle, separator} = baseOption;
        const fullTitle = title ? `${baseTitle} ${separator} ${title}` : baseTitle;
        document.title = fullTitle;
        console.info("update title", fullTitle);
    }, [title]);

    useWillUnmountEffect(() => {
        document.title = prevTitle.current;
    });

    return children;
});

Object.assign(DocumentTitle, {register: <K extends keyof BaseOption>(option: Pick<BaseOption, K> | BaseOption) => Object.assign(baseOption, option)});

export {DocumentTitle};
