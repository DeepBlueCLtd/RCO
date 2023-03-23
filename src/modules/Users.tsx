import { List, Datagrid, TextField, EditButton, useRecordContext, Edit, SimpleForm, TextInput, usePermissions } from "react-admin";

export const UserList = () => {
    const { isLoading, permissions } = usePermissions();
    if (isLoading) return null;
    return (
        <>
            {permissions === 'admin' ?
                <List>
                    <Datagrid>
                        <TextField source="id" />
                        <TextField source="name" />
                        <TextField source="isAdmin" />
                        <EditButton />;
                    </Datagrid>
                </List>
                :
                <h4 className="text-center">You are not authenticated to access this page</h4>
            }
        </>
    )
}
const Title = () => {
    const record = useRecordContext();
    return <span>Post {record ? `"${record.name}"` : ''}</span>;
};

export const UserEdit = () => (
    <Edit title={<Title />}>
        <SimpleForm>
            <TextInput disabled source="id" />
            <TextInput source="name" />
            <TextInput source="password" />
        </SimpleForm>
    </Edit>
);