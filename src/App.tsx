import { Admin, Resource, CustomRoutes } from 'react-admin';
import { Route } from 'react-router-dom';
import { dataProvider } from './providers/dataProvider';

// pages
import Welcome from './pages/Welcome';

// resources
import users from './resources/users';

import { autProvider } from './providers/authProvider';

function App() {
	return (
		<Admin dataProvider={dataProvider} authProvider={autProvider}>
			{(permissions) => {
				return [
					...(permissions == 'admin' ? [<Resource name="users" {...users} />] : []),
					<CustomRoutes>
						<Route path="/" element={<Welcome />} />
					</CustomRoutes>
				]
			}}
		</Admin>
	);
}

export default App;
