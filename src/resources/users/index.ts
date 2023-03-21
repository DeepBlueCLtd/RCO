import React from 'react';

const UserCreate = React.lazy(() => import('./UserCreate'));
const UserEdit = React.lazy(() => import('./UserEdit'));
const UserList = React.lazy(() => import('./UserList'));
const UserShow = React.lazy(() => import('./UserShow'));

const users = {
	create: UserCreate,
	edit: UserEdit,
	list: UserList,
	show: UserShow,
};

export default users;
