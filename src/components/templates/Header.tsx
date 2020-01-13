import React, {useEffect, useState} from "react";
import {Student} from "../../data/student/types";
import {getLoggedUser} from "../../data/student";


const Header: React.FC = () => {
    const [user, setUser] = useState<Student | undefined>();

    useEffect(() => {
        getLoggedUser().then(res => setUser(res.data))
    }, []);

    return (
        <div id="header" className="flex justify-between py-1 px-3 bg-indigo-500 h-12 shadow-md">
            <img src="https://via.placeholder.com/50" />
            <input type="text" />
            <img src="/img/user.svg" className="rounded-full" style={{width:40}}/>
        </div>
    );
};

export default Header;