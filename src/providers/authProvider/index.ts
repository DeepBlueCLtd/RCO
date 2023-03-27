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
		login: async ({ username, password }) => {
			const data = await dataProvider.getList('users', {
				sort: { field: "id", order: "ASC" },
					pagination: { page: 1, perPage: 1 },
					filter: { name: username, password }
			})
			if (data.data) {
				const user = data.data.find((item: any) => item.name === username);
				if (user) {
					if (user.password === password) {
						const token = JSON.stringify(user)
						setToken(token);
						audit(AuditType.LOGIN, 'Logged in');
						return await Promise.resolve(data);
					} else {
						throw new Error("Wrong password");
					}
				}
				else {
					throw new Error("Wrong username");
				}
				
			} else {
				return await Promise.reject();
			}
			
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
		checkError: async (error) => {
			const status = error.status;
			if (status === 401 || status === 403) {
				removeToken();
				await Promise.reject(); return;
			}
			await Promise.resolve();
		},
		getIdentity: async () => {
			const { data } = await dataProvider.me();
			return data;
		},

		getPermissions: async () => {
			try {
				const token = getToken();
				if (token != null) {
					const user = JSON.parse(token);
					return await Promise.resolve(user.adminRights ? 'admin' : 'user');
				} else {
					throw new Error('You are not a registered user.')
				}
			} catch (error) {
				await Promise.resolve(); 
			}
		},
	});
};

export default authProvider;
