import React from "react"
import {Tabs} from "antd"
import StudentsDashboard from "../../../components/Student/StudentsDashboard"
import StudentsImport from "../../../components/Student/StudentsImport"

const {TabPane} = Tabs

export type PageStatus = {
    current: number
    size?: number
    total?: number
}


const StudentPanel: React.FC = () => (
    <Tabs defaultActiveKey="1">
        <TabPane tab={"Utilisateurs"} key={1}>
            <StudentsDashboard/>
        </TabPane>
        <TabPane tab={"Importation"} key={2}>
            <StudentsImport/>
        </TabPane>
    </Tabs>
)

export default StudentPanel