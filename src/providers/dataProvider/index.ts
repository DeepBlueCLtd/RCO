import localForageDataProvider from 'ra-data-local-forage';
import { withLifecycleCallbacks, type DeleteResult, type CreateResult, type UpdateResult, type DataProvider } from 'react-admin';
import constants from '../../constants';
import { AuditType, trackEvent } from '../../utils/audit';
import platforms from './platforms';
import users from './users';
import localForage from 'localforage'
import { getReferenceData } from './reference-data';

export const getDataProvider = async (): Promise<DataProvider<string>> => {
	const defaultData: Record<string, any> = {
		users,
		platforms,
		organisation: getReferenceData('Organisation'),
		department: getReferenceData('Department'),
		vault: getReferenceData("Vault"),
		'protective-marking': getReferenceData('Protective Marking'),
		'protective-marking-authority': getReferenceData('Protective Marking Authority'),
		'platform-originator': getReferenceData('Platform Originator')
	};

	const provider = await localForageDataProvider({
		prefixLocalForageKey: constants.LOCAL_STORAGE_DB_KEY,
		defaultData,
	});

	await localForage.getItem(`${constants.LOCAL_STORAGE_DB_KEY}users`).then((item) => {
		if (item === null) {
			localForage.config({
				name: `${constants.LOCAL_STORAGE_DB_KEY}users`
			})
			localForage.setItem(`${constants.LOCAL_STORAGE_DB_KEY}users`, users)
			localForage.setItem(`${constants.LOCAL_STORAGE_DB_KEY}platforms`, platforms)
		}
	})
	await Promise.all(Object.keys(defaultData).map(async (key) => {
		const values = defaultData[key];
		await localForage.setItem(`${constants.LOCAL_STORAGE_DB_KEY}${key}`, values)
	}))
	const providerWithCustomMethods = { ...provider };
	const audit = trackEvent(providerWithCustomMethods);
	return withLifecycleCallbacks(
		providerWithCustomMethods,
		[
			{
				resource: 'users',
				afterDelete: async (record: DeleteResult<User>) => {
					await audit(AuditType.DELETE_USER, `User deleted (${record.data.id})`);
					return record;
				},
				afterCreate: async (record: CreateResult<User>) => {
					await audit(AuditType.CREATE_USER, `User created (${record.data.id})`);
					return record;
				},
				afterUpdate: async (record: UpdateResult<User>) => {
					await audit(AuditType.EDIT_USER, `User updated (${record.data.id})`);
					return record;
				},
			},
		]
	)
};
