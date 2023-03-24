import React from 'react';
import { Create, Edit, Show } from 'react-admin';
import UserForm from '../../components/UserForm';
import UserShow from './UserShow';

const UserList = React.lazy(() => import('./UserList'));

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
