import React, {useEffect, useState} from 'react';
import {
    Route,
    Switch,
} from 'react-router-dom';
import NotFound from '../../pages/erros/NotFound'
import Interceptor from "./Interceptor";
import Events from "../../pages/calendar";
import Event from "../../pages/event";
import Logout from "../../pages/security/Logout";
import {getLoggedUser} from "../../data/student";
import Loading from "../Common/Loading";
import {Provider} from "react-redux";
import {getUser} from "../../data/security";

import rootReducer from "../../redux/reducer";
import {createStore} from "redux";
import Navbar from "./Navbar";
import CustomGallery from "../../pages/gallery";


const Template: React.FC = () => {
    const [store, setStore] = useState();
    const [loading, setLoading] = useState<boolean>(true);
    useEffect(() => {
        getLoggedUser().then(res => {
            setStore(createStore(rootReducer, {user: res.data, payload: getUser()}));
            setLoading(false)
        })
    }, []);

    return loading ?
        <Loading/>
        :
        <Provider store={store}>
            <div className="h-full">
                <Interceptor/>
                <Navbar>
                    <div id="main" className="h-full overflow-y-auto bg-gray-100"
                         style={{height: "calc(100% - 3rem)"}}>
                        <Switch>
                            {/* Add your route here */}
                            <Route path="/calendar" component={Events}/>
                            <Route path="/event/:id" component={Event}/>
                            <Route path="/gallery/:id/picture/:pictureId" component={CustomGallery} />
                            <Route path="/gallery/:id" component={CustomGallery} />
                            <Route path="/logout" children={<Logout/>}/>
                            <Route path="*" component={NotFound}/>
                        </Switch>
                    </div>
                </Navbar>
            </div>
        </Provider>
};

export default Template;