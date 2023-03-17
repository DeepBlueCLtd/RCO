import { AUTH_CHECK, AUTH_GET_PERMISSIONS, AUTH_LOGIN, AUTH_LOGOUT } from 'react-admin';

export const autProvider = (type: string, params: any) => {
    if (type === AUTH_LOGIN) {
        const { username, password } = params;
        const { users } = JSON.parse(localStorage.getItem('rco') || "{ users: []}") as { users: User[] };
        const user = users.find(user => user.name === username && user.password === password);

        if (user) {
            localStorage.setItem('token', JSON.stringify(user));
            return Promise.resolve();
        }

        return Promise.reject("Invalid credentials!");
    }
    if (type === AUTH_LOGOUT) {
        localStorage.removeItem('token');
        return Promise.resolve();
    }
    if (type === AUTH_GET_PERMISSIONS) {
        const { adminRights } = JSON.parse(localStorage.getItem('token') || "{ adminRights: false}");
        return Promise.resolve(adminRights ? 'admin' : 'user');
    }
    if (type === AUTH_CHECK) {
        return localStorage.getItem('token') ? Promise.resolve() : Promise.reject();
    }
    return Promise.reject("Unknown error occur!");
}
