import React, {useEffect} from "react";
import {withRouter, RouteComponentProps} from "react-router";
import axios, {AxiosError, AxiosResponse} from 'axios';
import * as rf from '../../data/requestFactory';


const axiosResponseInterceptor = (response: AxiosResponse) => {
    // Do something with response data
    if (response.headers) {
        const token = response.headers['authorization'];
        const refreshToken = response.headers['x-refresh-token'];
        if (token && refreshToken) {
            rf.setToken({token, refreshToken});
        }
    }
    return response;
};

const axiosErrorInterceptor = (props: RouteComponentProps) => (error: AxiosError) => {
    props.history.push('/404');
    if (error.response) {
        switch (error.response.status) {
            case 404:
                props.history.push('/404');
                break;

            case 401:
            case 403:
                rf.clearToken();
                props.history.push('/login');
                break;

            case 500:
            case 400:
                break;
            case 503:

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