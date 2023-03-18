import React from 'react';
import { Admin, Resource, DataProvider } from 'react-admin';
import authProvider from './authProvider';
import { Login, Layout } from './layout';
import localForageDataProvider from 'ra-data-local-forage';
import UsersList from './users/usersList';
import UsersEdit from  './users/usersEdit';
import AuditList from './audit/auditList';

const App = () => {
  const [dataProvider, setDataProvider] = React.useState<DataProvider | undefined>();

  React.useEffect(() => {
    async function startDataProvider() {
      const localForageProvider = await localForageDataProvider({
        loggingEnabled: true,
        defaultData: {
          users: [
            {
              "id": 1,
              "name": "ian",
              "password": "admin",
              "adminRights": true
            },
            {
              "id": 2,
              "name": "jason",
              "password": "user",
              "adminRights": false
            }
          ],
          audits: []
        }
      });
      setDataProvider(localForageProvider);
    }

    if (!dataProvider) {
      startDataProvider();
    }
  }, [dataProvider]);

  if (!dataProvider) return <p>Loading...</p>;

  return (
    <Admin
      authProvider={authProvider}
      loginPage={Login}
      layout={Layout}
      dataProvider={dataProvider}
      disableTelemetry
      requireAuth
    >
      <Resource name="users" list={UsersList} edit={UsersEdit} />
      <Resource name='audits' list={AuditList} />
    </Admin>
  )
}

export default App
