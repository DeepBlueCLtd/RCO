import {
  withLifecycleCallbacks,
  type DataProvider,
  type ResourceCallbacks
} from 'react-admin'
import * as constants from '../../constants'
import { trackEvent } from '../../utils/audit'
import { extendLifeCycle, type AuditFunctionType } from './dataprovider-utils'
import UserLifeCycle from './resource-callbacks/UserLifeCycle'
import ProjectLifeCycle from './resource-callbacks/ProjectLifeCycle'
import BatchLifeCycle from './resource-callbacks/BatchLifeCycle'
import ItemLifeCycle from './resource-callbacks/ItemLifeCycle'
import { customMethods } from './resource-callbacks/LoanCustomMethods'
import ReferenceItemLifeCycle from './resource-callbacks/ReferenceItemLifeCycle'
import DispatchLifeCycle from './resource-callbacks/DispatchLifeCycle'
import DestructionLifeCycle from './resource-callbacks/DestructionLifeCycle'
import axios from 'axios'
import queryString from 'query-string'

export const lifecycleCallbacks = (
  audit: AuditFunctionType,
  provider: DataProvider
): Array<ResourceCallbacks<any>> => {
  return [
    DispatchLifeCycle(audit, provider),
    BatchLifeCycle(audit, provider),
    UserLifeCycle(audit),
    ProjectLifeCycle(audit),
    ItemLifeCycle(audit),
    extendLifeCycle(constants.R_PLATFORMS, audit),
    ReferenceItemLifeCycle(audit, constants.R_VAULT_LOCATION),
    ReferenceItemLifeCycle(audit, constants.R_ORGANISATION),
    ReferenceItemLifeCycle(audit, constants.R_PROTECTIVE_MARKING),
    ReferenceItemLifeCycle(audit, constants.R_CAT_CODE),
    ReferenceItemLifeCycle(audit, constants.R_CAT_HANDLING),
    ReferenceItemLifeCycle(audit, constants.R_CAT_CAVE),
    ReferenceItemLifeCycle(audit, constants.R_MEDIA_TYPE),
    ReferenceItemLifeCycle(audit, constants.R_DEPARTMENT),
    DestructionLifeCycle(audit)
  ]
}

const getConfigData = (): { configData: () => Promise<ConfigData | null> } => {
  return {
    configData: async function (this: DataProvider) {
      const { data: configTable } = await this.getList<ConfigData>(
        constants.R_CONFIG,
        {
          sort: { field: 'id', order: 'ASC' },
          pagination: { page: 1, perPage: 1000 },
          filter: {}
        }
      )
      return configTable !== null ? configTable[0] : null
    }
  }
}

export const getDataProvider = async (
  loggingEnabled: boolean
): Promise<CustomDataProvider & DataProvider<string>> => {
  console.log(loggingEnabled)
  const provider = dataProvider(
    process.env.VITE_API_URL ?? 'http://localhost:4000/api/tables'
  )

  const providerWithCustomMethods = {
    ...provider,
    ...customMethods(provider),
    ...getConfigData()
  }
  const audit = trackEvent(providerWithCustomMethods)

  return withLifecycleCallbacks(
    providerWithCustomMethods,
    lifecycleCallbacks(audit, providerWithCustomMethods)
  ) as CustomDataProvider & DataProvider
}

export const dataProvider = (apiUrl: string): DataProvider => ({
  getList: async (resource: string, params: any) => {
    const { page, perPage } = params.pagination
    let { field, order } = params.sort
    field = field === 'id' ? 'id' : field
    const ordering = order === 'ASC' ? `${field}` : `-${field}`
    params.filter = Object.keys(params.filter).reduce((acc: any, key) => {
      acc[key] = params.filter[key] ? 1 : 0
      return acc
    }, {})

    const filter = JSON.stringify(params.filter).replace(/[{} ""]/g, '')

    let query: any = {
      _page: page,
      _limit: perPage,
      _ordering: ordering,
      _filters: filter || undefined
    }
    if (resource === 'configData') {
      query = {
        _page: page,
        _limit: perPage
      }
    }
    const url = `${apiUrl}/${resource}/rows?${queryString.stringify({
      ...query
    })}`
    return await axios.get(url).then((response) => {
      const { data } = response.data

      // dataprovider getList should return data with ids
      if (resource === constants.R_CONFIG) {
        data[0].id = 1
      }
      if (resource === constants.R_USERS) {
        for (let i = 0; i < data.length; i++) {
          const item = data[i]
          const trimmedString = item.roles.slice(1, -1).trim()
          const stringWithoutQuotes = trimmedString.replace(/['"]+/g, '').trim()
          item.roles = stringWithoutQuotes.split(',')
        }
      }
      return { data, total: response.data.total }
    })
  },

  getOne: async (resource: string, params: any) => {
    const url = `${apiUrl}/${resource}/rows/${params.id}`

    return await axios.get(url).then((response) => {
      let { data } = response.data
      data = data[0]

      return { data }
    })
  },

  getMany: async (resource: string, params: any) => {
    const url = `${apiUrl}/${resource}/rows/${params.ids.toString()}`

    return await axios.get(url).then((response) => {
      const { data } = response.data

      return { data, total: response.data.total }
    })
  },

  getManyReference: async (resource: string, params: any) => {
    const { page, perPage } = params.pagination
    const { field, order } = params.sort

    const ordering = order === 'ASC' ? `${field}` : `-${field}`
    const filter = JSON.stringify(params.filter).replace(/[{} ""]/g, '')
    const query = {
      _page: page,
      _limit: perPage,
      _ordering: field !== 'id' ? ordering : undefined,
      _filters: filter ? `${filter},${params.target}:${params.id}` : undefined
    }

    const url = `${apiUrl}/${resource}/rows?${JSON.stringify(query)}`

    return await axios.get(url).then((response) => {
      const { data } = response.data

      return { data, total: response.data.total }
    })
  },

  create: async (resource: string, params: any) => {
    const url = `${apiUrl}/${resource}/rows`

    return await axios.post(url, { fields: params.data }).then((response) => {
      return { data: { id: response.data.lastInsertRowId, ...params.data } }
    })
  },

  update: async (resource: string, params: any) => {
    const url = `${apiUrl}/${resource}/rows/${params.id}`

    // remove the id property
    const { id, ...editData } = params.data

    return await axios.put(url, { fields: editData }).then((response) => {
      return { data: { id: response.data.lastInsertRowId, ...params.data } }
    })
  },

  updateMany: async (resource: string, params: any) => {
    const url = `${apiUrl}/${resource}/rows/${params.ids.toString()}`

    // remove the id property
    const { id, ...editData } = params.data
    return await axios.put(url, { fields: editData }).then(async () => {
      return { data: params.ids }
    })
  },

  delete: async (resource: string, params: any) => {
    const url = `${apiUrl}/${resource}/rows/${params.id}`

    return await axios.delete(url).then(() => {
      return { data: params.id }
    })
  },

  deleteMany: async (resource: string, params: any) => {
    const ids = params.ids.toString()
    const url = `${apiUrl}/${resource}/rows/${ids}`

    return await axios.delete(url).then(() => {
      return { data: params.ids }
    })
  }
})
