import React from 'react';
import {
	BooleanField,
	BulkDeleteButton,
	CreateButton,
	Datagrid,
	DeleteButton,
	EditButton,
	List,
	TextField,
	TopToolbar,
} from 'react-admin';

export default function UserList(): React.ReactElement {
	const ListActions = () => (
		<TopToolbar>
			<CreateButton />
		</TopToolbar>
	);

	return (
		<List actions={<ListActions />} perPage={25}>
			<Datagrid
				rowClick="show"
				bulkActionButtons={<BulkDeleteButton mutationMode="pessimistic" />}
			>
				<TextField source="name" />
				<TextField source="password" />
				<BooleanField source="adminRights" label="Admin Rights" />
				<EditButton />
				<DeleteButton mutationMode="pessimistic" />
			</Datagrid>
		</List>
	);
}
