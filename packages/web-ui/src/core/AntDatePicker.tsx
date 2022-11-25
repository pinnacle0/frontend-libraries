import dayjsGenerateConfig from "rc-picker/lib/generate/dayjs";
import generatePicker from "antd/es/date-picker/generatePicker";
import type {Dayjs} from "dayjs";
import "antd/es/date-picker/style";

export const AntDatePicker = generatePicker<Dayjs>(dayjsGenerateConfig);
