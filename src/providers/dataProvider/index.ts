import localStorageProvider from 'ra-data-local-storage';
import { withLifecycleCallbacks } from 'react-admin';
import constants from '../../constants';
import { AuditType, trackEvent } from '../../utils';
import users from './users';

export const dataProvider = localStorageProvider({
	loggingEnabled: true,
	localStorageKey: constants.LOCAL_STORAGE_DB_KEY,
	defaultData: {
		users,
	},
});

export const dataProviderWithLifeCycle = withLifecycleCallbacks(dataProvider, [
	{
		resource: 'users',
		afterDelete: async (record) => {
			trackEvent(AuditType.DELETE_USER, `User deleted ${record.data.id}`);
			return record;
		},
		afterSave: async (record) => {
			trackEvent(AuditType.CREATE_USER, `User created ${record.id}`);
			return record;
		},
		afterGetList: async (records) => {
			trackEvent(AuditType.LIST_USERS, `Get users list`);
			return records;
		},
		afterGetOne: async (record) => {
			trackEvent(AuditType.SHOW_USER, `Show user ${record.data.id}`);
			return record;
		},
		afterUpdate: async (record) => {
			trackEvent(AuditType.EDIT_USER, `Show user ${record.data.id}`);
			return record;
		},
	},
	{
		resource: 'audit',
		afterGetList: async (records) => {
			trackEvent(AuditType.LIST_AUDIT, `Get audit list`);
			return records;
		},
	},
]);
