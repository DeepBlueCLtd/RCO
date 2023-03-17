import { useState } from 'react'
import { Admin, CustomRoutes, Resource } from 'react-admin';
import { Route } from 'react-router';

import authProvider from './authProvider';
import { Login, Layout } from './layout';
import { lightTheme } from './layout/themes';
import Configuration from './configuration/Configuration';
import visitors from './visitors'

function App() {
  const [count, setCount] = useState(0)

  return (
    <Admin
      title=""
      authProvider={authProvider}
      loginPage={Login}
      layout={Layout}
      disableTelemetry
      theme={lightTheme}
        >
      <CustomRoutes>
          <Route path="/configuration" element={<Configuration />} />
      </CustomRoutes>
      {/* <Resource name="Customers" {...visitors} /> */}

    </Admin>
  )
}

export default App
