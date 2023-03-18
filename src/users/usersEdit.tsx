import {Edit, SimpleForm, TextInput, required} from 'react-admin'


const UsersEdit = () => {
    return (
        <Edit>
            <SimpleForm>
                <TextInput disabled label="Id" source="id" validate={required()}  fullWidth />
                <TextInput source="name" validate={required()}  fullWidth/>
                <TextInput source="password" validate={required()} fullWidth />
            </SimpleForm>
        </Edit>
    );
};

export default UsersEdit