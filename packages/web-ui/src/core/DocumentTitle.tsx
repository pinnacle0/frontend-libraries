import React from "react";

/**
 * <DocumentTitle> will set the document.title as one of following:
 *      {baseTitle}
 *      {baseTitle} {separator} {pageTitle}
 * According to latest <DocumentTitle> element.
 */
export interface Props {
    title?: string | null;
    children: React.ReactElement;
}

interface BaseOption {
    baseTitle: string;
    separator: string;
}

export class DocumentTitle extends React.PureComponent<Props> {
    static displayName = "DocumentTitle";
    static baseOption: BaseOption = {
        baseTitle: "<Document Title Unset>",
        separator: "-",
    };
    static register = <K extends keyof BaseOption>(option: Pick<BaseOption, K> | BaseOption) => Object.assign(DocumentTitle.baseOption, option);

    private readonly prevTitle: string;

    constructor(props: Props) {
        super(props);
        this.prevTitle = document.title;
    }

    componentDidMount() {
        this.updateTitle();
    }

    componentDidUpdate(prevProps: Readonly<Props>) {
        if (prevProps.title !== this.props.title) {
            this.updateTitle();
        }
    }

    componentWillUnmount() {
        document.title = this.prevTitle;
    }

    updateTitle = () => {
        const {title} = this.props;
        const {baseTitle, separator} = DocumentTitle.baseOption;
        const fullTitle = title ? `${baseTitle} ${separator} ${title}` : baseTitle;
        document.title = fullTitle;
    };

    render() {
        return this.props.children;
    }
}
