import axios, { AxiosPromise } from 'axios';
import { TokenSet, TokenPayload, Token } from './type';
import { Role } from '../users/type';

export const hasRole = (roles: Array<string>) => {
  const user = getUser();

  // bypass
  // return true;

  if (user) {
    return roles.filter(r => user.roles.includes(r)).length > 0;
  }
  return false;
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
    })
    .then(res => {
      setToken(res.data);
    });
};

export const setToken = (tokenSet: TokenSet) => {
  localStorage.setItem('token', tokenSet.token);
  localStorage.setItem('refreshToken', tokenSet.refreshToken);
  axios.defaults.headers.common['Authorization'] = `Bearer ${tokenSet.token}`;
  axios.defaults.headers.common['X-Refresh-Token'] = tokenSet.refreshToken;
};

export const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('refreshToken');
  delete axios.defaults.headers.common['Authorization'];
  delete axios.defaults.headers.common['X-Refresh-Token'];
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

export function getAllRoles(): AxiosPromise<Role[]> {
  return axios.get('/auth/roles');
}
