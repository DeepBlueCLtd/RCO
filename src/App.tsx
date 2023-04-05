import {
  Admin,
  Resource,
  CustomRoutes,
  Loading,
  type DataProvider,
  Login
} from 'react-admin'
import { Route } from 'react-router-dom'
import MyLayout from './components/Layout'
import React, { Suspense, useEffect, useState } from 'react'
import {
  Layers,
  Person,
  SettingsSuggest,
  Business,
  Workspaces,
  Security,
  LocationOn,
  Widgets,
  Shield,
  Camera
} from '@mui/icons-material'
import { getDataProvider } from './providers/dataProvider'
import autProvider from './providers/authProvider'

// pages
import Welcome from './pages/Welcome'

// resources
import users from './resources/users'
import audit from './resources/audit'
import { rcoTheme } from './themes/rco-theme'
import projects from './resources/projects'
import batches from './resources/batches'
import organisations from './resources/organisation'
import protectivemarkings from './resources/protective-marking'
import departments from './resources/department'
import vaultLocations from './resources/vault-location'
import platformOriginators from './resources/platform-originator'
import mediaTypes from './resources/media-type'
import protectiveMarkingAuthorities from './resources/protective-marking-authority'

const LoadingPage = <Loading loadingPrimary='Loading' loadingSecondary='' />

function App(): React.ReactElement {
  const [dataProvider, setDataProvider] = useState<DataProvider | undefined>(
    undefined
  )

  const handleGetProvider = (): any => {
    if (dataProvider !== undefined) return
    getDataProvider().then(setDataProvider).catch(console.log)
  }

  useEffect(handleGetProvider, [dataProvider])

  if (dataProvider === undefined) return LoadingPage

  return (
    <Suspense fallback={LoadingPage}>
      <Admin
        dataProvider={dataProvider}
        loginPage={Login}
        authProvider={autProvider(dataProvider)}
        layout={MyLayout}
        theme={rcoTheme}
        disableTelemetry
        requireAuth>
        {(permissions) => {
          return [
            ...(permissions === 'admin'
              ? [
                  <Resource
                    key='users'
                    icon={Person}
                    name='users'
                    recordRepresentation='name'
                    {...users}
                  />,
                  <Resource
                    key='audit'
                    options={{ label: 'Audit Log' }}
                    name='audit'
                    {...audit}
                  />,
                  <Resource
                    key='batches'
                    icon={Layers}
                    name='batches'
                    {...batches}
                  />,
                  <Resource
                    key='organisation'
                    name='organisation'
                    icon={Business}
                    {...organisations}
                  />,
                  <Resource
                    key='protective-marking'
                    name='protective-marking'
                    icon={Security}
                    options={{ label: 'Protective Marking' }}
                    {...protectivemarkings}
                  />,
                  <Resource
                    key='department'
                    name='department'
                    icon={Workspaces}
                    {...departments}
                  />,
                  <Resource
                    key='vault-location'
                    name='vault-location'
                    icon={LocationOn}
                    options={{ label: 'Vault Location' }}
                    {...vaultLocations}
                  />,
                  <Resource
                    key='platform-originator'
                    name='platform-originator'
                    icon={Widgets}
                    options={{ label: 'Platform Originator' }}
                    {...platformOriginators}
                  />,
                  <Resource
                    key='media-type'
                    name='media-type'
                    icon={Camera}
                    options={{ label: 'Media Type' }}
                    {...mediaTypes}
                  />,
                  <Resource
                    key='protective-marking-authority'
                    name='protective-marking-authority'
                    icon={Shield}
                    options={{ label: 'Protective Marking Authority' }}
                    {...protectiveMarkingAuthorities}
                  />
                ]
              : []),
            <Resource
              key='projects'
              icon={SettingsSuggest}
              name='projects'
              {...projects}
            />,

            <CustomRoutes key='routes'>
              <Route path='/' element={<Welcome />} />
            </CustomRoutes>
          ]
        }}
      </Admin>
    </Suspense>
  )
}

export default App
