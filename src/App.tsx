import { Admin, Resource, CustomRoutes, Loading, DataProvider } from 'react-admin';
import { Route } from 'react-router-dom';
import MyLayout from './components/Layout';
import { Suspense, useEffect, useState } from 'react';
import { Person } from '@mui/icons-material';

import * as providers from './providers/dataProvider';
import autProvider from './providers/authProvider';

// pages
import Welcome from './pages/Welcome';

// resources
import users from './resources/users';
import audit from './resources/audit';

const LoadingPage = <Loading loadingPrimary="Loading" loadingSecondary="" />

function App() {
	const [dataProvider, setDataProvider] = useState<DataProvider>();

	const handleGetProvider = () => {
		if (dataProvider) return;
		providers.provider.then((provider) => {
			setDataProvider(providers.getDataProvider(provider))
		})
	}

	useEffect(handleGetProvider, [dataProvider])

	if (!dataProvider) return LoadingPage;

	return (
		<Suspense
			fallback={LoadingPage}
		>
			<Admin
				dataProvider={dataProvider}
				authProvider={autProvider(dataProvider)}
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
