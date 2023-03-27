import {
	Admin,
	Resource,
	CustomRoutes,
	Loading,
	type DataProvider,
	Login,
} from 'react-admin';
import { Route } from 'react-router-dom';
import MyLayout from './components/Layout';
import React, { Suspense, useEffect, useState } from 'react';
import { Person } from '@mui/icons-material';
import { getDataProvider } from './providers/dataProvider';
import autProvider from './providers/authProvider';

// pages
import Welcome from './pages/Welcome';

// resources
import users from './resources/users';
import audit from './resources/audit';
import { rcoTheme } from './themes/rco-theme';
import ReferenceData from './pages/ReferenceData';
import ReferenceDataList from './components/ReferenceDataList';

const LoadingPage = <Loading loadingPrimary="Loading" loadingSecondary="" />;

function App(): React.ReactElement {
	const [dataProvider, setDataProvider] = useState<DataProvider | undefined>(undefined);

	const handleGetProvider = (): any => {
		if (dataProvider !== undefined) return;
		getDataProvider().then(setDataProvider);
	};


	useEffect(handleGetProvider, [dataProvider]);

	if (dataProvider === undefined) return LoadingPage;

	return (
		<Suspense fallback={LoadingPage}>
			<Admin
				dataProvider={dataProvider}
				loginPage={Login}
				authProvider={autProvider(dataProvider)}
				layout={MyLayout}
				theme={rcoTheme}
				disableTelemetry
				requireAuth
			>
				{(permissions) => {
					return [
						...(permissions === 'admin'
							? [
								<Resource key='users' icon={Person} name="users" {...users} />,
								<Resource key='audit' name="audit" {...audit} />,
								<CustomRoutes key='routes'>
									<Route path='/reference-data' element={<ReferenceData />}>
										<Route path="protective-marking" element={<ReferenceDataList />} />
										<Route path="protective-marking-authority" element={<ReferenceDataList />} />
										<Route path="department" element={<ReferenceDataList />} />
										<Route path="vault" element={<ReferenceDataList />} />
										<Route path="platform-originator" element={<ReferenceDataList />} />
										<Route path="organisation" element={<ReferenceDataList />} />
									</Route>
								</CustomRoutes>
							]
							: []),
						<CustomRoutes key='routes'>
							<Route path="/" element={<Welcome />} />
						</CustomRoutes>,
					];
				}}
			</Admin>
		</Suspense>
	);
}

export default App;
