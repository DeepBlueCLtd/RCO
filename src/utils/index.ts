import { dataProvider } from "../providers/dataProvider"

export enum AuditType {
    LOGIN = "login",
    LOGOUT = "logout",
    CREATE_USER = "create_user",
    DELETE_USER = "delete_user",
    SHOW_USER = "show_user",
    EDIT_USER = "edit_user",
    LIST_USERS = "list_users",
}

export const trackEvent = (type: AuditType, activity_detail?: string, defaultUser?: User) => {
    const userData = localStorage.getItem('token');
    if (!userData && !defaultUser) return;

    const user = defaultUser || JSON.parse(userData || '') as User;

    dataProvider.create<Audit>('audit', {
        data: {
            user_id: user.id,
            activity_type: type,
            date_time: new Date().toISOString(),
            activity_detail
        }
    })
}