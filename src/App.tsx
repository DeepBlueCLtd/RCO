import { Admin, Resource, CustomRoutes, Loading } from 'react-admin';
import { BrowserRouter, Route } from 'react-router-dom';
import MyLayout from './components/Layout';
import { Person } from '@mui/icons-material';

import { dataProviderWithLifeCycle } from './providers/dataProvider';
import autProvider from './providers/authProvider';

// pages
import Welcome from './pages/Welcome';

// resources
import users from './resources/users';
import audit from './resources/audit';
import { Suspense } from 'react';

function App() {
	return (
		<Suspense fallback={<Loading loadingPrimary='Loading' loadingSecondary='' />}>
			<Admin
				dataProvider={dataProviderWithLifeCycle}
				authProvider={autProvider}
				layout={MyLayout}
			>
				{(permissions) => {
					return [
						...(permissions == 'admin'
							? [
								<Resource icon={Person} name="users" {...users} />,
								<Resource name="audit" {...audit} />,
							]
							: []),
						<CustomRoutes>
							<Route path="/" element={<Welcome />} />
						</CustomRoutes>,
					];
				}}
			</Admin>
		</Suspense>
	);
}

export default App;
