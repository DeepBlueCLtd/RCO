import {
	Datagrid,
	List,
	TextField,
	FunctionField,
	ReferenceField,
} from 'react-admin';
import dayjs from 'dayjs';
import constants from '../../constants';

export default function AuditList() {
	const renderDateTime = (record: Audit) =>
		dayjs(record.date_time).format(constants.DATETIME_FORMAT);

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
				<FunctionField label="Date Time" render={renderDateTime} />;
				<TextField source="activity_type" label="Activity Type" />
				<TextField source="activity_detail" label="Activity Details" />
			</Datagrid>
		</List>
	);
}
