import { AuthProvider } from 'react-admin';
import constants from '../../constants';
import { AuditType, trackEvent } from '../../utils';
import userData from '../dataProvider/users';

const authProvider: AuthProvider = {
	login: (params) => {
		const { username, password } = params;
		const { users } = JSON.parse(
			localStorage.getItem(constants.LOCAL_STORAGE_DB_KEY) ||
				JSON.stringify({ users: userData })
		) as { users: User[] };
		const user = users.find(
			(user) => user.name === username && user.password === password
		);

		if (user) {
			localStorage.setItem('token', JSON.stringify(user));
			trackEvent(AuditType.LOGIN, 'Logged in');
			return Promise.resolve();
		}

		return Promise.reject('Invalid credentials!');
	},
	logout: () => {
		trackEvent(AuditType.LOGOUT, 'Logged out');
		localStorage.removeItem('token');
		return Promise.resolve();
	},
	checkAuth: () => {
		const token = localStorage.getItem('token');
		return token ? Promise.resolve() : Promise.reject();
	},
	checkError: (error) => {
		const status = error.status;
		if (status === 401 || status === 403) {
			localStorage.removeItem('token');
			return Promise.reject();
		}
		return Promise.resolve();
	},
	getIdentity: () => {
		const token = localStorage.getItem('token');
		return Promise.resolve(JSON.parse(token || ''));
	},
	getPermissions: () => {
		const token = localStorage.getItem('token');
		if (token) {
			const { adminRights } = JSON.parse(token);
			return Promise.resolve(adminRights ? 'admin' : 'user');
		}
		return Promise.resolve();
	},
};

export default authProvider;
