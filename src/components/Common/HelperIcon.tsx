import React from "react";
import {Popover} from "antd";
import {IconFA} from "./IconFA";

type HelperIconProps = {
    text: string
}

const HelperIcon: React.FC<HelperIconProps> = ({text}) => (
    <Popover
        title=""
        trigger="hover"
        content={<p className="font-dinotl text-xs">{text}</p>}
            >
        <span className="ml-2 cursor-pointer"><IconFA name="fa-question-circle"/></span>
    </Popover>
);

export default HelperIcon;