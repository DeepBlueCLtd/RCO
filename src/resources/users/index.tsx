import React from 'react';
import { Create, Edit } from 'react-admin';
import UserForm from '../../components/UserForm';

const UserList = React.lazy(async () => await import('./UserList'));
const UserShow = React.lazy(async () => await import('./UserShow'));

const UserCreate = (): React.ReactElement => {
  return (
    <Create>
      <UserForm />
    </Create>
  );
};

const UserEdit = (): React.ReactElement => {
  return (
    <Edit>
      <UserForm />
    </Edit>
  );
};

const users = {
  create: UserCreate,
  edit: UserEdit,
  list: UserList,
  show: UserShow
};

export default users;
