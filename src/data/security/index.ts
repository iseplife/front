import {Token, TokenPayload} from './types';
import axios from 'axios';
import {clearToken, setToken} from "../requestFactory";

export const hasRole = (roles: Array<string>) => {
    const user = getUser();
    return Boolean(user && roles.filter(r => user.roles.includes(r)).length > 0);
};

export const isLoggedIn = () => {
    return !!localStorage.getItem('token');
};

export const connect = (username: string, password: string): Promise<void> => {
    logout();
    return axios
        .post('/auth', {
            username,
            password,
        }).then(res => {
            setToken(res.data);
        });
};

export const logout = () => {
    clearToken();
};

export const getUser = (): TokenPayload | null => {
    const token = localStorage.getItem('token');
    let rawdata = '';
    if (token) {
        rawdata = token.split('.')[1];
        try {
            const tokenJson = JSON.parse(atob(rawdata)) as Token;
            return JSON.parse(tokenJson.payload) as TokenPayload;
        } catch (e) {
            return null;
        }
    }
    return null;
};