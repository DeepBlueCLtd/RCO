import React from 'react';
import { Create, Edit, Show } from 'react-admin';
import UserForm from '../../components/UserForm';

const UserList = React.lazy(() => import('./UserList'));
const UserShow = React.lazy(() => import('./UserShow'));

const UserCreate = () => {
	return (
		<Create>
			<UserForm />
		</Create>
	);
}

const UserEdit = () => {
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
