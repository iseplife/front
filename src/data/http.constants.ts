const url = process.env.REACT_APP_API_URL || "api.dev.iseplife.fr"

export const apiURI = `${process.env.REACT_APP_HTTP_PROTOCOL || "https"}://${url}`
export const wsURI = `${process.env.REACT_APP_WS_PROTOCOL || "wss"}://${url}/ws`