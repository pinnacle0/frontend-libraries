import React from "react";

interface Props {
    tags: string[];
    onRemove: (index: number) => void;
}

export class TagLabel extends React.PureComponent<Props> {
    static displayName = "TagLabel";

    render() {
        const {tags, onRemove} = this.props;
        return tags.map((tag, index) => {
            return (
                <div className="g-tag-input-label" key={index}>
                    {tag}
                    <i onClick={() => onRemove(index)}>&times;</i>
                </div>
            );
        });
    }
}
