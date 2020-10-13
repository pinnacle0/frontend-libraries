import React from "react";
import {TagInput} from "@pinnacle0/web-ui/core/TagInput";

export const TagInputDemo = () => {
    const [tags, setTags] = React.useState<string[]>(["a", "B"]);
    return <TagInput tags={tags} onChangeTags={setTags} parser={t => [t]} />;
};
