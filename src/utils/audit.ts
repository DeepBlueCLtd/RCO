import { DataProvider } from 'react-admin';
import constants from '../constants';
export enum AuditType {
	LOGIN = 'login',
	LOGOUT = 'logout',
	CREATE_USER = 'create_user',
	DELETE_USER = 'delete_user',
	EDIT_USER = 'edit_user',
}

export const trackEvent = (dataProvider: DataProvider) => async (type: AuditType, activity_detail?: string) => {
	try {

		const data = JSON.parse(localStorage.getItem(constants.TOKEN_KEY)??'')
		if (data) {
			await dataProvider.create<Audit>('audit', {
				data: {
					user_id: data.id,
					activity_type: type,
					date_time: new Date().toISOString(),
					activity_detail,
				},
			});
		}

	} catch (error) {
		console.log(error);
	}
};
