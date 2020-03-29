import React from 'react';
import {
    Route,
    Switch,
} from 'react-router-dom';
import NotFound from '../../pages/erros/NotFound';
import Navbar from "./Navbar";


const AdminTemplate: React.FC = () => {
    return (
            <div className="h-full">
                <Navbar>
                    <div id="main" className="h-full overflow-y-auto bg-gray-100" style={{height: "calc(100% - 3rem)"}}>
                        <Switch>
                            <Route path="*" component={NotFound}/>
                        </Switch>
                    </div>
                </Navbar>
            </div>
    )
};

export default AdminTemplate;