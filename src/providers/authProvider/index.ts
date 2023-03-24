import { AuthProvider } from 'react-admin';
import constants from '../../constants';
import { AuditType, trackEvent } from '../../utils/audit';
import { dataProvider } from '../dataProvider';

export const getToken = () => {
	return localStorage.getItem(constants.TOKEN_KEY);
};

const setToken = (token: string) => {
	return localStorage.setItem(constants.TOKEN_KEY, token);
};

const removeToken = () => {
	return localStorage.removeItem(constants.TOKEN_KEY);
};

const authProvider: AuthProvider = {
	login: async (params) => {
		const { data } = await dataProvider.login(params);
		setToken(data.token);
		trackEvent(AuditType.LOGIN, 'Logged in');
		return Promise.resolve(data);
	},
	logout: () => {
		trackEvent(AuditType.LOGOUT, 'Logged out');
		removeToken();
		return Promise.resolve();
	},
	checkAuth: () => {
		const token = getToken();
		return token ? Promise.resolve() : Promise.reject();
	},
	checkError: (error) => {
		const status = error.status;
		if (status === 401 || status === 403) {
			removeToken();
			return Promise.reject();
		}
		return Promise.resolve();
	},
	getIdentity: async () => {
		const { data } = await dataProvider.me();
		return data;
	},

	getPermissions: async () => {
		try {
			const { data } = await dataProvider.me();
			return Promise.resolve(data.adminRights ? 'admin' : 'user');
		} catch (error) {
			return Promise.resolve();
		}
	},
};

export default authProvider;
