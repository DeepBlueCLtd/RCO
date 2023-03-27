import localForageDataProvider from 'ra-data-local-forage';
import { type DataProvider, withLifecycleCallbacks } from 'react-admin';
import constants from '../../constants';
import { AuditType, trackEvent } from '../../utils/audit';
import users from './users';
import localForage from 'localforage'


export const getDataProvider = async () => {
	const provider = await localForageDataProvider({
		prefixLocalForageKey: constants.LOCAL_STORAGE_DB_KEY,
		defaultData: {
			users,
		},
	});

	localForage.getItem(`${constants.LOCAL_STORAGE_DB_KEY}users`).then((item) => {
		if (item === null) {
			localForage.config({
				name: `${constants.LOCAL_STORAGE_DB_KEY}users`
			})
			localForage.setItem(`${constants.LOCAL_STORAGE_DB_KEY}users`, users)
		} else {
			return;
		}
	})

	const providerWithCustomMethods = { ...provider };
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
