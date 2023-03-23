import { List, Datagrid, TextField, DateField } from "react-admin";

export const ReportsList = () => {
    return (
        <List>
            <Datagrid>
                <TextField source="id" />
                <TextField source="name" />
                <TextField source="isAdmin" />
                <TextField source="activityType" />
                <TextField source="activityDetail" />
                <DateField source="date" showTime locales="hi-Hi" />
            </Datagrid>
        </List>
    )
}