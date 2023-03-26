import {
	Admin,
	Resource,
	CustomRoutes,
	Loading,
	DataProvider,
	Login,
} from 'react-admin';
import { Route } from 'react-router-dom';
import MyLayout from './components/Layout';
import preval from 'preval.macro';
import { Suspense, useState, useEffect } from 'react';
import { Person } from '@mui/icons-material';
import { getDataProvider } from './providers/dataProvider';
import autProvider from './providers/authProvider';

// pages
import Welcome from './pages/Welcome';

// resources
import users from './resources/users';
import audit from './resources/audit';

const LoadingPage = <Loading loadingPrimary="Loading" loadingSecondary="" />;

function App() {
	const [dataProvider, setDataProvider] = useState<DataProvider>();

	const handleGetProvider = () => {
		if (dataProvider) return;
		getDataProvider().then(setDataProvider);
	};

	// const appBuildDate = preval`module.exports = process.env = 'development' = new Date().toISOString().slice(0, 19).replace('T', ' ')`;
	// console.log('appBuildDate', appBuildDate);
	// const trimmedAppBuildDate = appBuildDate.substring(
	// 	0,
	// 	appBuildDate.length - 3
	// );
	useEffect(handleGetProvider, [dataProvider]);

	if (!dataProvider) return LoadingPage;

	return (
		<Suspense fallback={LoadingPage}>
			<Admin
				dataProvider={dataProvider}
				loginPage={Login}
				authProvider={autProvider(dataProvider)}
				layout={MyLayout}
				disableTelemetry
				requireAuth
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
