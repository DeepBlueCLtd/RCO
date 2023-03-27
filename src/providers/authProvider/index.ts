import { type AuthProvider, type DataProvider } from 'react-admin';
import constants from '../../constants';
import { AuditType, trackEvent } from '../../utils/audit';

export const getToken = (): string | null => {
	return localStorage.getItem(constants.TOKEN_KEY);
};

const setToken = (token: string): void => {
	localStorage.setItem(constants.TOKEN_KEY, token);
};

const removeToken = (): void => {
	localStorage.removeItem(constants.TOKEN_KEY);
};

const authProvider = (dataProvider: DataProvider): AuthProvider => {
	const audit = trackEvent(dataProvider);
	return ({
		login: async (params) => {
			const { data } = await dataProvider.login(params);
			setToken(data.token);
			audit(AuditType.LOGIN, 'Logged in');
			return Promise.resolve(data);
		},
		logout: (): any => {
			audit(AuditType.LOGOUT, 'Logged out');
			removeToken();
			return Promise.resolve();
		},
		checkAuth: (): any => {
			const token = getToken();
			return (token !== null) ? Promise.resolve() : Promise.reject();
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
				const user = data as User
				return Promise.resolve(user.adminRights ? 'admin' : 'user');
			} catch (error) {
				return Promise.resolve();
			}
		},
	});
};

export default authProvider;
