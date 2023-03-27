import localForageDataProvider from 'ra-data-local-forage';
import { type DataProvider, withLifecycleCallbacks } from 'react-admin';
import constants from '../../constants';
import { AuditType, trackEvent } from '../../utils/audit';
import { getToken } from '../authProvider';
import platforms from './platforms';
import users from './users';
import localForage from 'localforage'

const customProvider = (dataProvider: DataProvider) => ({
	login: (params: { username: string; password: string }) => {
		return new Promise(async (resolve, reject) => {
			try {
				const { username, password } = params;
				const { data } = await dataProvider.getList('users', {
					sort: { field: "id", order: "ASC" },
					pagination: { page: 1, perPage: 1 },
					filter: { name: username, password }
				});
				const user = data[0];
				if (user) {
					const token = JSON.stringify(user);
					const data = { ...user, token };
					resolve({ data });
				} else {
					reject({ status: 401 });
				}
			} catch (error: any) {
				reject({ status: 500, message: error.message });
			}
		});
	},
	me: () => {
		return new Promise(async (resolve, reject) => {
			try {
				const token = getToken();
				if (!token) {
					return reject({ status: 404 });
				}
				const user = JSON.parse(token) as User;
				const result = await dataProvider.getOne('users', { id: user.id });
				if (result) {
					resolve(result);
				} else {
					reject({ status: 404 });
				}
			} catch (error: any) {
				reject({ status: 500, message: error.message });
			}
		});
	},
});

export const getDataProvider = async () => {


	const provider = await localForageDataProvider({
		prefixLocalForageKey: constants.LOCAL_STORAGE_DB_KEY,
		defaultData: {
			users,
			platforms
		},
	});
	localForage.config({
		name: `${constants.LOCAL_STORAGE_DB_KEY}users`
	})
	localForage.setItem(`${constants.LOCAL_STORAGE_DB_KEY}users`, users)
	localForage.setItem(`${constants.LOCAL_STORAGE_DB_KEY}platforms`, platforms)
	const providerWithCustomMethods = { ...provider, ...customProvider(provider) };
	const audit = trackEvent(providerWithCustomMethods);
	return withLifecycleCallbacks(
		providerWithCustomMethods,
		[
			{
				resource: 'users',
				afterDelete: async (record) => {
					audit(AuditType.DELETE_USER, `User deleted (${record.data.id})`);
					return record;
				},
				afterCreate: async (record) => {
					audit(AuditType.CREATE_USER, `User created (${record.data.id})`);
					return record;
				},
				afterUpdate: async (record) => {
					audit(AuditType.EDIT_USER, `User updated (${record.data.id})`);
					return record;
				},
			},
		]
	)
};
