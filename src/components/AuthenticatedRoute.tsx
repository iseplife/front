import React from "react"
import {Route, Redirect, RouteProps} from "react-router"


interface AuthenticatedRouteProps extends RouteProps {
    roles: string[]
}

const AuthenticatedRoute: React.FC<AuthenticatedRouteProps> = ({
    component: Component,
    roles,
    ...rest
}) => {
    const authenticated = true
    return (
        <Route {...rest} render={props =>
            (authenticated && Component
                ? (<Component {...props} />)
                : (<Redirect to={{
                    pathname: "/login",
                    state: {
                        from: props.location
                    }
                }}/>)
            )}
        />
    )
}

export default AuthenticatedRoute