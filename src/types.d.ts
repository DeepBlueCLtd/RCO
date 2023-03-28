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
	activity_detail?: string;
}

interface Platform {
	id: number;
	name: string;
	active: boolean;
}

interface Project {
	id: number;
	name: string;
	start_date: string;
	end_date: string;
	project_code: string;
	remarks: string;
}
