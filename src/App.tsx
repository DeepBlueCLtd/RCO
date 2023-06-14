import {
  Admin,
  Resource,
  CustomRoutes,
  Loading,
  type DataProvider,
  type AuthProvider
} from 'react-admin'
import { Route } from 'react-router-dom'
import MyLayout from './components/Layout'
import React, { Suspense, useEffect, useState } from 'react'
import { AllInbox, Groups } from '@mui/icons-material'
import { getDataProvider } from './providers/dataProvider'
import rcoAuthProvider from './providers/authProvider'

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
import vaultlocations from './resources/vault-locations'
import loadDefaultData from './utils/init-data'
import { type FilterType } from './resources/audit/AuditList'
import { canAccess } from './providers/authProvider/permissions'
import { protectedRoutes } from './hooks/useCanAccess'
import addresses from './resources/addresses'
import dispatch from './resources/dispatch'
import destruction from './resources/destruction'

const LoadingPage = <Loading loadingPrimary='Loading' loadingSecondary='' />

function App(): React.ReactElement {
  const [dataProvider, setDataProvider] = useState<DataProvider | undefined>(
    undefined
  )
  const [permissions, setPermissions] = useState<ResourcePermissions>({})
  const [authProvider, setAuthProvider] = useState<AuthProvider | undefined>(
    undefined
  )
  const [loggingPref, setLoggingPref] = useState<boolean>(false)
  const handleGetProvider = (): any => {
    if (loggingPref !== null) {
      getDataProvider(loggingPref)
        .then((provider) => {
          setDataProvider(provider)
          const authenticationProvider = rcoAuthProvider(provider)
          setAuthProvider(authenticationProvider)
          authenticationProvider
            .getPermissions({})
            .then(setPermissions)
            .catch(console.log)
          if (provider !== undefined && dataProvider === undefined) {
            const queryParams = new URLSearchParams(window.location.search)
            const username = queryParams.get('username')
            const password = queryParams.get('password')
            if (username !== null && password !== null) {
              authenticationProvider
                .login({ username, password })
                .then((_: any) => {
                  window.history.replaceState({}, '', window.location.pathname)
                })
                .catch(console.log)
            }
          }
        })
        .catch(console.log)
    }
  }

  useEffect(() => {
    const storedValue = localStorage.getItem(constants.LOGGING_ENABLED)
    if (storedValue !== null) {
      setLoggingPref(storedValue === 'true')
    } else {
      setLoggingPref(false)
    }

    const onStorageChange = (event: any): void => {
      if (event.key === constants.LOGGING_ENABLED) {
        setLoggingPref(event.newValue === 'true')
      }
    }

    window.addEventListener('storage', onStorageChange)
    return () => {
      window.removeEventListener('storage', onStorageChange)
    }
  }, [])

  useEffect(() => {
    const UI_VERSION = localStorage.getItem(constants.APP_VERSION)
    if (UI_VERSION !== null) {
      if (process.env.VITE_APP_VERSION !== UI_VERSION) {
        localStorage.setItem(
          constants.APP_VERSION,
          process.env.VITE_APP_VERSION ?? '1'
        )
        Object.keys(localStorage).forEach((k) => {
          if (k !== 'rco-user' && k !== 'salt') {
            localStorage.removeItem(k)
          }
        })
        if ('caches' in window) {
          caches
            .keys()
            .then((values) => {
              values.forEach((v) => {
                caches.delete(v).catch(console.log)
              })
            })
            .catch(console.log)
        }
      }
    } else {
      localStorage.setItem(
        constants.APP_VERSION,
        process.env.VITE_APP_VERSION ?? '1'
      )
    }
  }, [])

  useEffect(() => {
    const DATA_VERSION = localStorage.getItem(constants.DATA_VERSION)
    if (DATA_VERSION !== null) {
      if (process.env.VITE_DATA_VERSION !== DATA_VERSION) {
        loadDefaultData().catch(console.log)
        localStorage.setItem(
          constants.DATA_VERSION,
          process.env.VITE_DATA_VERSION ?? '1'
        )
      }
    } else {
      localStorage.setItem(
        constants.DATA_VERSION,
        process.env.VITE_DATA_VERSION ?? '1'
      )
    }
  }, [])

  useEffect(handleGetProvider, [loggingPref])
  if (dataProvider === undefined) return LoadingPage
  if (authProvider === undefined) return LoadingPage

  const referenceDataPermission = {
    read: canAccess(permissions, 'reference-data', { read: true }),
    write: canAccess(permissions, 'reference-data', { write: true })
  }

  return (
    <Suspense fallback={LoadingPage}>
      <Admin
        dashboard={Welcome}
        dataProvider={dataProvider}
        loginPage={Login}
        authProvider={authProvider}
        layout={MyLayout}
        theme={rcoTheme}
        disableTelemetry>
        <Resource
          key={constants.R_VAULT_LOCATION}
          name={constants.R_VAULT_LOCATION}
          icon={AllInbox}
          options={{ label: 'Vault Locations' }}
          {...protectedRoutes(
            permissions,
            constants.R_VAULT_LOCATION,
            vaultlocations
          )}
        />
        <Resource
          key={constants.R_USERS}
          name={constants.R_USERS}
          icon={Groups}
          {...protectedRoutes(permissions, constants.R_USERS, users)}
        />
        <CustomRoutes key='routes'>
          <Route path='/protectiveMarking'>
            {...createRoutes(
              'protectiveMarking',
              undefined,
              referenceDataPermission
            )}
          </Route>
          <Route path='/catCode'>
            {...createRoutes('catCode', undefined, referenceDataPermission)}
          </Route>
          <Route path='/catHandling'>
            {...createRoutes('catHandling', undefined, referenceDataPermission)}
          </Route>
          <Route path='/catCave'>
            {...createRoutes('catCave', undefined, referenceDataPermission)}
          </Route>
          <Route path='/protectiveMarkingAuthority'>
            {...createRoutes(
              'protectiveMarkingAuthority',
              undefined,
              referenceDataPermission
            )}
          </Route>
          <Route path='/department'>
            {...createRoutes('department', undefined, referenceDataPermission)}
          </Route>
          <Route path='/platformOriginator'>
            {...createRoutes(
              'platformOriginator',
              undefined,
              referenceDataPermission
            )}
          </Route>
          <Route path='/organisation'>
            {...createRoutes(
              'organisation',
              undefined,
              referenceDataPermission
            )}
          </Route>
          <Route path='/mediaType'>
            {...createRoutes('mediaType', undefined, referenceDataPermission)}
          </Route>
          <Route path='/platforms'>
            {...createRoutes('platforms', platforms, referenceDataPermission)}
          </Route>
          <Route path='/users'>
            {...createRoutes('users', users, referenceDataPermission)}
          </Route>
          <Route path='/audit'>
            {...createRoutes('audit', audit, referenceDataPermission)}
          </Route>
          <Route path='/reference-data' element={<ReferenceData />} />
        </CustomRoutes>
        <Resource
          key={constants.R_ADDRESSES}
          icon={constants.ICON_ADDRESSES}
          name={constants.R_ADDRESSES}
          {...protectedRoutes(permissions, constants.R_ADDRESSES, addresses)}
        />
        <Resource
          key={constants.R_PROJECTS}
          icon={constants.ICON_PROJECT}
          name={constants.R_PROJECTS}
          {...protectedRoutes(permissions, constants.R_PROJECTS, projects)}
        />
        <Resource
          key={constants.R_BATCHES}
          icon={constants.ICON_BATCH}
          name={constants.R_BATCHES}
          {...protectedRoutes(permissions, constants.R_BATCHES, batches)}
        />
        <Resource
          key={constants.R_ITEMS}
          icon={constants.ICON_ITEM}
          name={constants.R_ITEMS}
          options={{
            filter: {
              dispatchedDate: undefined,
              destructionDate: undefined
            },
            label: 'Live Items'
          }}
          {...protectedRoutes(permissions, constants.R_ITEMS, items)}
        />
        <Resource
          key={constants.R_ALL_ITEMS}
          icon={constants.ICON_ALL_ITEM}
          name={constants.R_ALL_ITEMS}
          options={{ label: 'All Items' }}
          {...protectedRoutes(permissions, constants.R_ALL_ITEMS, items)}
        />
        <Resource
          key={constants.R_DISPATCH}
          icon={constants.ICON_DISPATCH}
          name={constants.R_DISPATCH}
          {...protectedRoutes(permissions, constants.R_DISPATCH, dispatch)}
        />
        <Resource
          key={constants.R_DESTRUCTION}
          icon={constants.ICON_DESTRUCTION}
          name={constants.R_DESTRUCTION}
          {...protectedRoutes(permissions, constants.R_ITEMS, destruction)}
        />
      </Admin>
    </Suspense>
  )
}

interface ElementsProps {
  name: string
  filter?: FilterType
}

interface Elements {
  create?: React.FunctionComponent<ElementsProps>
  edit?: React.FunctionComponent<ElementsProps>
  list?: React.FunctionComponent<ElementsProps>
}

const defaultElements: ResourceRoutes = {
  create: ReferenceDataCreate,
  edit: ReferenceDataEdit,
  list: ReferenceDataList
}

const createRoutes = (
  name: string,
  elements: Elements = defaultElements,
  permissions?: Permission
): React.ReactNode[] => {
  const cName: string = name

  const { read, write } =
    typeof permissions !== 'undefined'
      ? permissions
      : { read: false, write: false }

  const routes: React.ReactElement[] = []

  const {
    create = ReferenceDataCreate,
    edit = ReferenceDataEdit,
    list = ReferenceDataList
  } = elements

  if (read === true) {
    routes.push(
      <Route
        key={`${cName}list`}
        index
        element={React.createElement(list, { name })}
      />
    )
  }
  if (write === true) {
    routes.push(
      ...[
        <Route
          key={`${cName}edit`}
          path={`/${cName}:id`}
          element={React.createElement(edit, { name })}
        />,
        <Route
          key={`${cName}create`}
          path='create'
          element={React.createElement(create, { name })}
        />
      ]
    )
  }

  return routes
}

export default App
