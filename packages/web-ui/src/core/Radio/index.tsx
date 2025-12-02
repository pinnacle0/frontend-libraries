import React from "react";
import type {RadioChangeEvent, RadioProps} from "antd/es/radio";
import AntRadio from "antd/es/radio";
import {ReactUtil} from "../../util/ReactUtil";

export type {RadioChangeEvent};
export interface Props extends RadioProps {}

export const Radio = ReactUtil.compound("Radio", {Button: AntRadio.Button, Group: AntRadio.Group}, (props: Props) => <AntRadio {...props} />);
