import {
    BooleanField,
    CreateButton,
    Datagrid,
    DeleteButton,
    EditButton,
    List,
    TextField,
    TopToolbar
} from 'react-admin';

export default function UserList() {

    const ListActions = () => (
        <TopToolbar>
            <CreateButton />
        </TopToolbar>
    );

    return (
        <List actions={<ListActions />}>
            <Datagrid rowClick="show">
                <TextField source="id" />
                <TextField source="name" />
                <TextField source="password" />
                <BooleanField source="adminRights" label="Admin Rights" />
                <EditButton />
                <DeleteButton />
            </Datagrid>
        </List>
    );
}
