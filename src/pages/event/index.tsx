import React from "react";
import {
    useParams
} from "react-router-dom";

const Event: React.FC = () => {
    const {id} = useParams();
    return (
        <div> event numéro : {id}</div>
    );
};

export default Event;