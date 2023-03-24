import { Admin, Resource, CustomRoutes, Loading } from 'react-admin';
import { Route } from 'react-router-dom';
import MyLayout from './components/Layout';
import { Person } from '@mui/icons-material';

import { dataProvider } from './providers/dataProvider';
import autProvider from './providers/authProvider';

// pages
import Welcome from './pages/Welcome';

// resources
import users from './resources/users';
import audit from './resources/audit';
import { Suspense } from 'react';
import platforms from './resources/platforms';

const LoadingPage = <Loading loadingPrimary="Loading" loadingSecondary="" />

function App() {

	if (!dataProvider) return LoadingPage;

	return (
		<Suspense
			fallback={LoadingPage}
		>
			<Admin
				dataProvider={dataProvider}
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
							<Resource name="platforms" {...platforms} />,
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
