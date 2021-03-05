import React from "react"
import ReactDOM from "react-dom"
import * as serviceWorker from "./serviceWorker"
import "./i18n"
import {
    BrowserRouter as Router,
    Route,
    Switch,
    Redirect
} from "react-router-dom"
import {initializeAPIClient} from "./data/requestFactory"
import Login from "./pages/security"
import {isLoggedIn} from "./data/security"
import Template from "./components/Template"
import {RecoilRoot} from "recoil/dist"

export const apiClient = initializeAPIClient()

const App: React.FC = () => (
    <RecoilRoot>
        <Router>
            <Switch>
                <Route path="/login" component={Login}/>
                <Route path="/" render={({location}) => (
                    isLoggedIn() ?
                        <Template/>
                        :
                        <Redirect
                            to={{
                                pathname: "/login",
                                state: {from: location}
                            }}
                        />
                )}
                />
            </Switch>
        </Router>
    </RecoilRoot>
)

ReactDOM.render(<App/>, document.getElementById("root"))
serviceWorker.register()
