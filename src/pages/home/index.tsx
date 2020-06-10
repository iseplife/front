import React from "react";
import Feed from "../../components/Feed";


const Home: React.FC = () => {
    return (
        <div>
            <Feed id={1} className="mx-auto my-3 md:w-3/6 w-full"/>
        </div>
    )
}
export default Home;