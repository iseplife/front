const url = process.env.REACT_APP_API_URL || "192.168.1.47:8080"

export const apiURI = `${process.env.REACT_APP_HTTP_PROTOCOL || "http"}://${url}`
export const wsURI = `${process.env.REACT_APP_WS_PROTOCOL || "ws"}://${url}/ws`