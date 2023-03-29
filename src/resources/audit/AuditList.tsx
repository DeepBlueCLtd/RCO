import React from 'react';
import {
	Datagrid,
	List,
	TextField,
	ReferenceField,
	DateField,
} from 'react-admin';

export default function AuditList(): React.ReactElement {
	return (
		<List
			perPage={25}
			sort={{
				field: 'date_time',
				order: 'DESC',
			}}
		>
			<Datagrid bulkActionButtons={false}>
				<ReferenceField source="user_id" reference="users" />
				<DateField source="date_time" label="Date Time" showTime />;
				<TextField source="activity_type" label="Activity Type" />
				<TextField source="activity_detail" label="Activity Details" />
			</Datagrid>
		</List>
	);
}
