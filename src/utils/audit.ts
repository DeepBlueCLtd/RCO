import { type DataProvider } from 'react-admin';

export enum AuditType {
	LOGIN = 'login',
	LOGOUT = 'logout',
	CREATE_USER = 'create_user',
	DELETE_USER = 'delete_user',
	EDIT_USER = 'edit_user',
}

export const trackEvent = (dataProvider: DataProvider) => async (type: AuditType, activity_detail?: string) => {
	try {
		const { data } = await dataProvider.me();
		await dataProvider.create<Audit>('audit', {
			data: {
				user_id: data.id,
				activity_type: type,
				date_time: new Date().toISOString(),
				activity_detail,
			},
		});
	} catch (error) {
		console.log(error);
	}
};
