import React, {useState} from "react";
import {useParams} from "react-router-dom";

const Club: React.FC = () => {
    const {id} = useParams();
    const [loading, setLoading] = useState<boolean>(false);

    return (
        <div>

        </div>
    )
}

export default Club;