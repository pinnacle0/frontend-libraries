import dayjsGenerateConfig from "rc-picker/lib/generate/dayjs";
import generatePicker from "antd/es/date-picker/generatePicker";
import type {Dayjs} from "dayjs";

export const AntDatePicker = generatePicker<Dayjs>(dayjsGenerateConfig);
