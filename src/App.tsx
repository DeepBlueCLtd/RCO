import {
  Admin,
  Resource,
  CustomRoutes,
  Loading,
  type DataProvider
} from 'react-admin'
import { Route } from 'react-router-dom'
import MyLayout from './components/Layout'
import React, { Suspense, useEffect, useState } from 'react'
import { Save, Layers, AccountTree } from '@mui/icons-material'
import { getDataProvider } from './providers/dataProvider'
import autProvider from './providers/authProvider'

// pages
import Welcome from './pages/Welcome'
import Login from './pages/Login'

// resources
import users from './resources/users'
import audit from './resources/audit'
import { rcoTheme } from './themes/rco-theme'
import ReferenceData from './pages/ReferenceData'
import ReferenceDataList from './components/ReferenceDataList'
import projects from './resources/projects'
import batches from './resources/batches'
import ReferenceDataCreate, {
  ReferenceDataEdit
} from './resources/reference-data'
import items from './resources/items'
import * as constants from './constants'
import platforms from './resources/platforms'

const LoadingPage = <Loading loadingPrimary='Loading' loadingSecondary='' />

function App(): React.ReactElement {
  const [dataProvider, setDataProvider] = useState<DataProvider | undefined>(
    undefined
  )
  const [loggingPref, setLoggingPref] = useState<boolean>(false)
  const handleGetProvider = (): any => {
    if (loggingPref !== null)
      getDataProvider(loggingPref).then(setDataProvider).catch(console.log)
  }

  useEffect(() => {
    const storedValue = localStorage.getItem(constants.LOGGING_ENABLED)
    if (storedValue !== null) {
      setLoggingPref(storedValue === 'true')
    } else {
      setLoggingPref(false)
    }

    const onStorageChange = (event: any) => {
      if (event.key === constants.LOGGING_ENABLED) {
        setLoggingPref(event.newValue === 'true')
      }
    }

    window.addEventListener('storage', onStorageChange)
    return () => {
      window.removeEventListener('storage', onStorageChange)
    }
  }, [])

  useEffect(handleGetProvider, [loggingPref])
  if (dataProvider === undefined) return LoadingPage

  return (
    <Suspense fallback={LoadingPage}>
      <Admin
        dashboard={Welcome}
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
                    key={constants.R_BATCHES}
                    icon={Layers}
                    name={constants.R_BATCHES}
                    {...batches}
                  />,
                  <Resource
                    key={constants.R_ITEMS}
                    icon={Save}
                    name={constants.R_ITEMS}
                    {...items}
                  />,
                  <CustomRoutes key='routes'>
                    <Route path='/reference-data' element={<ReferenceData />}>
                      <Route path='protectiveMarking'>
                        {...createRoutes('protectiveMarking')}
                      </Route>
                      <Route path='protectiveMarkingAuthority'>
                        {...createRoutes('protectiveMarkingAuthority')}
                      </Route>
                      <Route path='department'>
                        {...createRoutes('department')}
                      </Route>
                      <Route path='vaultLocation'>
                        {...createRoutes('vaultLocation')}
                      </Route>
                      <Route path='platformOriginator'>
                        {...createRoutes('platformOriginator')}
                      </Route>
                      <Route path='organisation'>
                        {...createRoutes('organisation')}
                      </Route>
                      <Route path='mediaType'>
                        {...createRoutes('mediaType')}
                      </Route>
                      <Route path='platforms'>
                        {...createRoutes('platforms', platforms)}
                      </Route>
                      <Route path='users'>
                        {...createRoutes('users', users)}
                      </Route>
                      <Route path='audit'>
                        {...createRoutes('audit', audit)}
                      </Route>
                    </Route>
                  </CustomRoutes>
                ]
              : []),
            <Resource
              key={constants.R_PROJECTS}
              icon={AccountTree}
              name={constants.R_PROJECTS}
              {...projects}
            />
          ]
        }}
      </Admin>
    </Suspense>
  )
}

interface ElementsProps {
  name: string
}

interface Elements {
  create?: React.FunctionComponent<ElementsProps>
  edit?: React.FunctionComponent<ElementsProps>
  list?: React.FunctionComponent<ElementsProps>
}

const defaultElements = {
  create: ReferenceDataCreate,
  edit: ReferenceDataEdit,
  list: ReferenceDataList
}

const createRoutes = (name: string, elements: Elements = defaultElements) => {
  const cName: string = name

  const {
    create = ReferenceDataCreate,
    edit = ReferenceDataEdit,
    list = ReferenceDataList
  } = elements

  return [
    <Route
      key={`${cName}list`}
      index
      element={React.createElement(list, { name })}
    />,
    <Route
      key={`${cName}edit`}
      path=':id'
      element={React.createElement(edit, { name })}
    />,
    <Route
      key={`${cName}create`}
      path='create'
      element={React.createElement(create, { name })}
    />
  ]
}

export default App
