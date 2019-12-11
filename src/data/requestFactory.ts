import axios from 'axios';

const url = process.env.REACT_APP_BACKEND_URL || "localhost:8080";
const httpProtocol = process.env.REACT_APP_HTTP_PROTOCOL || "http";
const wsProtocol = process.env.REACT_APP_WS_PROTOCOL || "ws";

export const apiURI = `${httpProtocol}://${url}`;
export const swURI = `${wsProtocol}://${url}`;

export function initializeAxios() {
    const token = localStorage.getItem('token');
    const refreshToken = localStorage.getItem('refreshToken');

    axios.defaults.baseURL = apiURI;
    if (token && refreshToken) {
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        axios.defaults.headers.common['X-Refresh-Token'] = refreshToken;
        axios.defaults.headers.common['Access-Control-Max-Age'] = '3600';
    }
}