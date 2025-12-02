import React from "react";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import {ReactUtil} from "../../util/ReactUtil";

// load plugin when component is imported
dayjs.extend(relativeTime);

export interface Props {
    date: Date;
}

export const RelativeTime = ReactUtil.memo("RelativeTime", ({date}: Props) => {
    const [elapsedText, setElapsedText] = React.useState("-");
    const repaintTimeout = React.useRef<NodeJS.Timeout | undefined>(undefined);

    const repaint = React.useCallback(() => {
        clearTimeout(repaintTimeout.current);

        const elapsedText = dayjs(date).fromNow();
        setElapsedText(elapsedText);
        /**
         * dayjs relative time plugin uses 45 minutes for "an hour ago" threshold and 45 seconds for "a minute ago" threshold.
         * Repaint after 15 minutes / seconds interval should be good enough for now.
         * See: https://day.js.org/docs/en/customization/relative-time
         */
        const isAnHourAgo = Date.now() - date.getTime() > 3600 * 1000;
        const timeoutDuration = isAnHourAgo ? 15 * 1000 * 60 : 15 * 1000;
        repaintTimeout.current = setTimeout(repaint, timeoutDuration);
    }, [date]);

    React.useEffect(() => {
        repaint();
        return () => clearTimeout(repaintTimeout.current);
    }, [repaint]);

    return elapsedText;
});
