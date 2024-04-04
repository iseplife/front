import React from "react"
import {
    Route,
    Switch,
} from "react-router-dom"
import Dashboard from "../../pages/admin/dashboard"
import StudentPanel from "../../pages/admin/student"
import AdminHeader from "./AdminHeader"
import GroupPanel from "../../pages/admin/group"
import ClubPanel from "../../pages/admin/club"
import SurveyPanel from "../../pages/admin/survey"
import NotFound from "../../pages/errors/NotFound"
import ReportPanel from "../../pages/admin/report"


const AdminTemplate: React.FC = () => {
    return (
        <div className="bg-[#fff5e8] h-full">
            <AdminHeader/>
            <main className="bg-[#fff5e8]">
                <div className="max-w-7xl mx-auto pt-6 pb-3 sm:px-6 lg:px-8 h-[calc(100vh-50px)] overflow-y-auto">
                    <Switch>
                        <Route path="/admin/user/:id" exact component={StudentPanel}/>
                        <Route path="/admin/user" exact component={StudentPanel}/>
                        <Route path="/admin/club/:id" exact component={ClubPanel}/>
                        <Route path="/admin/club" exact component={ClubPanel}/>
                        <Route path="/admin/group/:id" exact component={GroupPanel}/>
                        <Route path="/admin/group" exact component={GroupPanel}/>
                        <Route path="/admin/survey" exact component={SurveyPanel}/>
                        <Route path="/admin/report" exact component={ReportPanel}/>
                        <Route path="/admin" exact component={Dashboard}/>
                        <Route path="*" component={NotFound}/>
                    </Switch>
                </div>
            </main>
        </div>
    )
}

export default AdminTemplate
