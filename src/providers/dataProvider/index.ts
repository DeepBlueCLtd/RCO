import localForageDataProvider from 'ra-data-local-forage';
import {
	withLifecycleCallbacks,
	type DeleteResult,
	type CreateResult,
	type UpdateResult,
	type DataProvider,
} from 'react-admin';
import constants from '../../constants';
import { AuditType, trackEvent } from '../../utils/audit';
import platforms from './platforms';
import users from './users';
import { getReferenceData } from './reference-data';

export const getDataProvider = async (): Promise<DataProvider<string>> => {
	const defaultData: Record<string, any> = {
		users,
		platforms,
		organisation: getReferenceData('Organisation'),
		department: getReferenceData('Department'),
		vault: getReferenceData('Vault'),
		'protective-marking': getReferenceData('Protective Marking'),
		'protective-marking-authority': getReferenceData(
			'Protective Marking Authority'
		),
		'platform-originator': getReferenceData('Platform Originator'),
	};

	const provider = await localForageDataProvider({
		prefixLocalForageKey: constants.LOCAL_STORAGE_DB_KEY,
		defaultData,
	});
	const providerWithCustomMethods = { ...provider };
	const audit = trackEvent(providerWithCustomMethods);
	return withLifecycleCallbacks(providerWithCustomMethods, [
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
		{
			resource: 'projects',
			afterDelete: async (record: DeleteResult<Project>) => {
				const recId = record.data.id;
				await audit(AuditType.DELETE_PROJECT, `Project deleted (${recId})`);
				return record;
			},
			afterCreate: async (record: CreateResult<Project>) => {
				await audit(
					AuditType.CREATE_PROJECT,
					`Project created (${record.data.id})`
				);
				return record;
			},
			afterUpdate: async (record: UpdateResult<Project>) => {
				await audit(
					AuditType.EDIT_PROJECT,
					`Project updated (${record.data.id})`
				);
				return record;
			},
		},
	]);
};
