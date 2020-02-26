import React from "react";
import {IconFA} from "../Common/IconFA";
import {Avatar} from "antd";
import {useSelector} from "react-redux";
import {AppState} from "../../redux/types";

const PostForm: React.FC = () => {
    const user = useSelector((state: AppState) => state.user);

    return (
        <div className="flex flex-col items-center">
            <div className="flex justify-start">

            </div>
            <div className="flex flex-col bg-white rounded-lg w-4/6 h-20 py-3 px-4 text-gray-500">
                <textarea placeholder="What's on your mind ?" className="flex-1 bg-transparent resize-none"/>
                <div className="flex justify-between">
                    <div className="flex items-center">
                        <IconFA name="fa-images" className="cursor-pointer mx-1"/>
                        <IconFA name="fa-chart-bar" className="cursor-pointer mx-1"/>
                    </div>

                    <div>
                        <Avatar icon="user" src={user.photoUrlThumb} className="h-5 w-5 ml-1" />
                        <IconFA name="fa-paper-plane" className="cursor-pointer"/>
                    </div>
                </div>
            </div>

        </div>
    );
};

export default PostForm;