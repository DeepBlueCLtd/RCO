import * as React from 'react';
import {
  List,
  TextField,
  Datagrid,
  EditButton,
  usePermissions

} from 'react-admin';

import  {MyPagination}  from '../pagination/MyPagination';

const UsersList = () => {
  const {permissions} = usePermissions()
    return (
       <>
        <List pagination={<MyPagination />}>
            <Datagrid>
              <TextField source="id" />
              <TextField source="name" />
              <TextField source="password" />
             {permissions ?  <EditButton /> : ''}
            </Datagrid>
        </List>
       </>
    );
};

export default UsersList