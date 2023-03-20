interface User {
	id: number;
	name: string;
	password: string;
	adminRights: boolean;
}

interface Audit {
	id: number;
	activity_type: AuditType;
	date_time: string;
	activity_detail?: string
}

enum AuditType {
	LOGIN = "login",
	LOGOUT = "logout",
	CREATE_USER = "create_user",
	DELETE_USER = "delete_user",
	SHOW_USER = "show_user",
	EDIT_USER = "edit_user",
	LIST_USERS = "list_users",
}