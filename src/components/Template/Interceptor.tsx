import React, {useEffect} from "react";
import {withRouter, RouteComponentProps} from "react-router";
import axios, {AxiosError, AxiosResponse} from 'axios';
import {removeTokens, setTokens} from "../../data/security";
import {message} from "antd";


const axiosResponseInterceptor = (response: AxiosResponse) => {
    // Do something with response data
    if (response.headers) {
        const token = response.headers['authorization'];
        const refreshToken = response.headers['x-refresh-token'];
        if (token && refreshToken) {
            setTokens({token, refreshToken});
        }
    }
    return response;
};

const axiosErrorInterceptor = (props: RouteComponentProps) => (error: AxiosError) => {
    if (error.response) {
        switch (error.response.status) {
            case 404:
                props.history.push('/404');
                break;
            case 401:
            case 403:
                removeTokens();
                props.history.push('/login');
                message.error('Vous avez été déconnecté !');
                break;

            case 500:
            case 400:
                message.error('Un probleme a été rencontré');
                console.error( `[${error.code}] ${error.message}`);
                break;
            case 503:
                message.error('Serveur indisponible');
                break;

            default:
                break;
        }
    }
    return <p>Dommage</p>;
};

const Interceptor: React.FC<RouteComponentProps> = (props: RouteComponentProps) => {
    useEffect(() => {
        const intercept = axios.interceptors.response.use(
            axiosResponseInterceptor,
            axiosErrorInterceptor(props)
        );

        return () => {
            axios.interceptors.response.eject(intercept);
        }
    }, [props]);
    return null;
};

export default withRouter(Interceptor);