import React from 'react';
import {
    Route,
    Switch,
} from 'react-router-dom';
import NotFound from '../../pages/erros/NotFound';
import Dashboard from "../../pages/admin/dashboard";
import Student from "../../pages/admin/student";
import AdminHeader from "./AdminHeader";
import Club from "../../pages/admin/club";
import GroupPanel from "../../pages/admin/group";


const AdminTemplate: React.FC = () => {
    return (
        <div className="bg-gray-100 h-full">
            <AdminHeader/>
            <main>
                <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
                    <Switch>
                        <Route path="/admin/user/:id" component={Student}/>
                        <Route path="/admin/user" component={Student}/>
                        <Route path="/admin/club/:id" component={Club}/>
                        <Route path="/admin/club" component={Club}/>
                        <Route path="/admin/group/:id" component={GroupPanel}/>
                        <Route path="/admin/group" component={GroupPanel}/>
                        <Route path="/admin" component={Dashboard}/>
                        <Route path="*" component={NotFound}/>
                    </Switch>
                </div>
            </main>
        </div>
    )
};

export default AdminTemplate;