import { Datagrid, List, TextField, FunctionField, ReferenceField } from 'react-admin'
import dayjs from 'dayjs';
import constants from '../../constants';

export default function AuditList() {

    const renderDateTime = (record: Audit) => dayjs(record.date_time).format(constants.DATETIME_FORMAT);

    return (
        <List>
            <Datagrid bulkActionButtons={false}>
                <TextField source="id" label="Id" />
                <ReferenceField source="user_id" reference="users" />
                <FunctionField
                    label="Date Time"
                    render={renderDateTime}
                />;
                <TextField source="activity_type" label="Activity Type" />
                <TextField source='activity_detail' label="Activity Details" />
            </Datagrid>
        </List>
    )
}
