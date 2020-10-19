import React from "react";
import {TagInput} from "@pinnacle0/web-ui/core/TagInput";

export const TagInputDemo = () => {
    const initialValue = Array.from({length: 100}, () => ({value: Math.random().toString(36).substring(7)}));
    const [tags, setTags] = React.useState(initialValue);
    return <TagInput className={t => t.value} renderTag={t => t.value} value={tags} onChange={setTags} parser={t => [{value: t}]} />;
};
