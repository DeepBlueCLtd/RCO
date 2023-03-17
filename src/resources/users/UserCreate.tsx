import { Create } from 'react-admin';
import UserForm from '../../components/UserFrom';

export default function UserCreate() {
	return (
		<Create>
			<UserForm />
		</Create>
	);
}
