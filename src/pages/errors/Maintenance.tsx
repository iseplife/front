import React from "react"
import ErrorInterface from "./ErrorInterface"


const Maintenance: React.FC = () => {
    return <ErrorInterface error="error:no_connection_retry" />
}

export default Maintenance