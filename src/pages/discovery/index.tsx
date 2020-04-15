import React from "react";
import DiscoveryClub from "../../components/Discovery/DiscoveryClub";
import DiscoveryStudent from "../../components/Discovery/DiscoveryStudent";

export const MOBILE_WIDTH = 500;

interface SpacerProps {
    spacing?: number
}

export const HorizontalSpacer = (props: SpacerProps) => {
    let size: string = "my-" + (props.spacing || 2);
    return (
        <div className={size}/>
    );
};

const Discovery: React.FC = () => {
    return (
        <div>
            <div className="w-5/6 sm:w-1/2 max-w-4xl mx-auto my-8 text-sm sm:text-2xl">Lorem ipsum
                dolor sit amet,
                consectetur adipisicing elit. Debitis nihil saepe similique? Ad aspernatur
                consectetur cupiditate deserunt dolore doloremque dolorum eligendi expedita facere,
                fugit modi molestias officiis perspiciatis quia saepe suscipit velit? Aliquam, quae,
                quas.
            </div>
            <DiscoveryClub/>

        </div>
    );
};
export default Discovery;