import { SimpleForm, TextInput, BooleanInput, Create, Edit, Show } from 'react-admin';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import PlatformList from './PlatformList';

const schema = yup.object({
	name: yup.string().required(),
	password: yup.string().max(8).min(4),
	adminRights: yup.boolean(),
});

const PlatformForm = (): React.ReactElement => {
	const defaultValues = {
		name: '',
		active: true
	};
	return (
		<SimpleForm defaultValues={defaultValues} resolver={yupResolver(schema)}>
			<TextInput source="name" variant="outlined" sx={{ width: '100%' }} />
			<BooleanInput source="active" />
		</SimpleForm>
	);
}

const PlatformCreate = (): React.ReactElement => {
	return (
		<Create>
			<PlatformForm />
		</Create>
	);
}

const PlatformEdit = () => {
	return (
		<Edit>
			<PlatformForm />
		</Edit>
	);
}

const PlatformShow = () => {
	return (
		<Show>
			<PlatformForm />
		</Show>
	);
}

const platforms = {
	create: PlatformCreate,
	edit: PlatformEdit,
	list: PlatformList,
	show: PlatformShow,
};

export default platforms;
