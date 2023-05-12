import localForageDataProvider from 'ra-data-local-forage'
import {
  withLifecycleCallbacks,
  type DataProvider,
  type ResourceCallbacks
} from 'react-admin'
import * as constants from '../../constants'
import { trackEvent } from '../../utils/audit'
import localForage from 'localforage'
import loadDefaultData from '../../utils/init-data'
import { type AuditFunctionType } from './dataprovider-utils'
import UserLifeCycle from './resource-callbacks/UserLifeCycle'
import ProjectLifeCycle from './resource-callbacks/ProjectLifeCycle'
import BatchLifeCycle from './resource-callbacks/BatchLifeCycle'
import ItemLifeCycle from './resource-callbacks/ItemLifeCycle'
import { customMethods } from './resource-callbacks/LoanCustomMethods'

export const lifecycleCallbacks = (
  audit: AuditFunctionType,
  provider: DataProvider
): Array<ResourceCallbacks<any>> => {
  return [
    UserLifeCycle(audit),
    ProjectLifeCycle(audit),
    BatchLifeCycle(audit, provider),
    ItemLifeCycle(audit)
  ]
}

export const getDataProvider = async (
  loggingEnabled: boolean
): Promise<DataProvider<string>> => {
  const localForageData = await localForage.keys()
  if (localForageData.length === 0) {
    await loadDefaultData()
  }

  const provider = await localForageDataProvider({
    prefixLocalForageKey: constants.LOCAL_STORAGE_DB_KEY,
    loggingEnabled
  })

  const providerWithCustomMethods = { ...provider, ...customMethods(provider) }
  const audit = trackEvent(providerWithCustomMethods)

  return withLifecycleCallbacks(
    providerWithCustomMethods,
    lifecycleCallbacks(audit, providerWithCustomMethods)
  )
}
