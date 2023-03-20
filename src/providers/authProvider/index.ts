import { AUTH_CHECK, AUTH_GET_PERMISSIONS, AUTH_LOGIN, AUTH_LOGOUT } from 'react-admin';
import constants from '../../constants';
import { AuditType, trackEvent } from '../../utils';
import userData from '../dataProvider/users';

export const autProvider = (type: string, params: any) => {

    if (type === AUTH_LOGIN) {
        const { username, password } = params;
        const { users } = JSON.parse(localStorage.getItem(constants.LOCAL_STORAGE_DB_KEY) || JSON.stringify({ users: userData })) as { users: User[] };
        const user = users.find(user => user.name === username && user.password === password);

        if (user) {
            localStorage.setItem('token', JSON.stringify(user));
            trackEvent(AuditType.LOGIN, "Logged in")
            return Promise.resolve();
        }

        return Promise.reject("Invalid credentials!");
    }
    if (type === AUTH_LOGOUT) {
        trackEvent(AuditType.LOGOUT, "Logged out")
        localStorage.removeItem('token');
        return Promise.resolve();
    }
    if (type === AUTH_GET_PERMISSIONS) {
        const token = localStorage.getItem('token');
        if (token) {
            const { adminRights } = JSON.parse(token);
            return Promise.resolve(adminRights ? 'admin' : 'user');
        }

    }

    if (type === AUTH_CHECK) {
        const token = localStorage.getItem('token');
        if (token) {
            return Promise.resolve();
        }
    }

    return Promise.reject("Unknown error occur!");
}
