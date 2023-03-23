import { Admin, Resource, CustomRoutes } from "react-admin";
import { Route } from "react-router-dom";
import localStorageDataProvider from 'ra-data-local-storage';
import { UserList, UserEdit } from "./modules/Users";
import { Dashboard } from "./modules/Dashboard";
import { ReportsList } from "./modules/ReportsList";
import MyLoginPage from "./modules/LoginPage";
import { LayoutComponent } from "./components/Layout";
import { authProvider } from "./providers/authProvider"
import { dataStore } from "./dataService";
import './App.css'

const dataProvider = localStorageDataProvider({
  defaultData: dataStore.default
});
const App = () => (
  <Admin basename="/RCO" layout={LayoutComponent} authProvider={authProvider} loginPage={MyLoginPage} dataProvider={dataProvider}>
    <CustomRoutes>
      <Route path="/dashboard" element={<Dashboard />} />
    </CustomRoutes>
    <Resource edit={UserEdit} name="users" list={UserList} />
    <Resource name="reports" list={ReportsList} />
  </Admin>
);

export default App;