import React from 'react';
import { Create, Edit } from 'react-admin';
import UserForm from '../../components/UserForm';

const UserList = React.lazy(() => import('./UserList'));
const UserShow = React.lazy(() => import('./UserShow'));

const UserCreate = (): React.ReactElement => {
	return (
		<Create>
			<UserForm />
		</Create>
	);
}

const UserEdit = (): React.ReactElement => {
	return (
		<Edit>
			<UserForm />
		</Edit>
	);
}

const users = {
	create: UserCreate,
	edit: UserEdit,
	list: UserList,
	show: UserShow,
};

export default users;
