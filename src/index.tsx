import React, {useReducer} from "react"
import ReactDOM from "react-dom"
import * as serviceWorker from "./serviceWorker"
import "./i18n"
import {
    BrowserRouter as Router,
    Route,
    Switch,
    Redirect
} from "react-router-dom"
import {initializeAPIClient} from "./data/http"
import Login from "./pages/security"
import {isLoggedIn} from "./data/security"
import Template from "./components/Template"
import {RecoilRoot} from "recoil"
import {AppContext, DEFAULT_STATE} from "./context/app/context"
import {appContextReducer} from "./context/app/reducer"
import Interceptor from "./components/Template/Interceptor"

initializeAPIClient()
const App: React.FC = () => {
    const [state, dispatch] = useReducer(appContextReducer, DEFAULT_STATE)
    return (
        <AppContext.Provider value={{ state, dispatch }}>
            <RecoilRoot>
                <Router>
                    <Interceptor />
                    <Switch>
                        <Route path="/login" component={Login}/>
                        <Route path="/" render={({location}) => (
                            isLoggedIn() ?
                                <Template/> :
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
        </AppContext.Provider>
    )
}

ReactDOM.render(<App/>, document.getElementById("root"))
serviceWorker.register()
