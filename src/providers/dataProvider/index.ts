import {
  withLifecycleCallbacks,
  type DataProvider,
  type ResourceCallbacks,
  HttpError
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
import localForageDataProvider from 'ra-data-local-forage'
import { getErrorDetails } from '../../utils/helper'

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
    ReferenceItemLifeCycle(audit, constants.R_CAT_HANDLE),
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
const sanitizeCode = (data: any): string | any => {
  if (typeof data === 'string') {
    return data.replace(/'/g, '\'\'')
  }
  return data
}

export const getDataProvider = async (
  loggingEnabled: boolean,
  MOCK: boolean
): Promise<CustomDataProvider & DataProvider<string>> => {
  const provider = !MOCK
    ? dataProvider(
        process.env.NODE_ENV === 'development'
          ? 'http://localhost:8000/api/tables'
          : '/api/tables'
      )
    : await localForageDataProvider({
        prefixLocalForageKey: constants.LOCAL_STORAGE_DB_KEY,
        loggingEnabled
      })

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

const operators = ['_neq', '_eq', '_lte', '_gte']
const SEARCH_OPERATOR = 'q'
const nullOperators = ['__null', '__notnull']
const bridgingTables = [
  constants.R_ITEMS_CODE,
  constants.R_ITEMS_CAVE,
  constants.R_ITEMS_HANDLE
]

export const dataProvider = (apiUrl: string): DataProvider => ({
  getList: async (resource: string, params: any) => {
    const { page, perPage } = params.pagination
    let { field, order } = params.sort
    field = field === 'id' ? 'id' : field
    const ordering = order === 'ASC' ? `${field}` : `-${field}`
    // converting boolean to 1 and 0 for filters
    params.filter = Object.keys(params.filter).reduce((acc: any, key) => {
      if (typeof params.filter[key] === 'boolean') {
        acc[key] = params.filter[key] ? 1 : 0
      } else {
        acc[key] = params.filter[key]
      }
      return acc
    }, {})

    let query: any = {}

    params.filter = Object.entries(params.filter).reduce(
      (acc: any, [key, value]) => {
        const foundOperator = operators.find((operator) =>
          key.includes(operator)
        )
        if (value === null) {
          if (foundOperator) {
            if (foundOperator === operators[0]) {
              const modifiedKey = key.replace(foundOperator, '')
              acc[`${modifiedKey}${nullOperators[1]}`] = ''
            } else if (foundOperator === operators[1]) {
              const modifiedKey = key.replace(foundOperator, '')
              acc[`${modifiedKey}${nullOperators[0]}`] = ''
            }
          } else {
            acc[`${key}__null`] = ''
          }
        } else if (foundOperator) {
          const modifiedKey = key.replace(
            foundOperator,
            `__${foundOperator.slice(1)}`
          )
          acc[modifiedKey] = value
        } else if (key === SEARCH_OPERATOR) {
          query._search = sanitizeCode(value)
        } else {
          acc[key] = value
        }

        return acc
      },
      {}
    )

    const filter = JSON.stringify(params.filter).replace(/[{} ""]/g, '')
    query = {
      ...query,
      _page: page,
      _limit: perPage,
      _ordering: ordering,
      _filters: filter || undefined
    }
    if (resource === constants.R_CONFIG) {
      query = {
        _page: page,
        _limit: perPage
      }
    }
    const url = `${apiUrl}/${resource}/rows?${queryString.stringify({
      ...query
    })}`
    return await axios
      .get(url)
      .then((response) => {
        const { data } = response.data

        // dataprovider getList should return data with ids
        if (resource === constants.R_CONFIG) {
          data[0].id = 1
        }

        return { data, total: response.data.total }
      })
      .catch(async (err) => {
        const { message, status, data } = getErrorDetails(err) ?? {}
        return await Promise.reject(new HttpError(message, status, data))
      })
  },

  getOne: async (resource: string, params: any) => {
    const url = `${apiUrl}/${resource}/rows/${params.id}`

    return await axios
      .get(url)
      .then((response) => {
        let { data } = response.data
        data = data[0]

        return { data }
      })
      .catch(async (err) => {
        const { message, status, data } = getErrorDetails(err) ?? {}
        return await Promise.reject(new HttpError(message, status, data))
      })
  },

  getMany: async (resource: string, params: any) => {
    const url = `${apiUrl}/${resource}/rows/${params.ids.toString()}`
    return await axios
      .get(url)
      .then((response) => {
        const { data } = response.data

        return { data, total: response.data.total }
      })
      .catch(async (err) => {
        const { message, status, data } = getErrorDetails(err) ?? {}
        return await Promise.reject(new HttpError(message, status, data))
      })
  },

  getManyReference: async (resource: string, params: any) => {
    const { page, perPage } = params.pagination
    const { field, order } = params.sort

    const ordering = order === 'ASC' ? `${field}` : `-${field}`

    // converting boolean to 1 and 0 for filters
    params.filter = Object.keys(params.filter).reduce((acc: any, key) => {
      if (typeof params.filter[key] === 'boolean') {
        acc[key] = params.filter[key] ? 1 : 0
      } else {
        acc[key] = params.filter[key]
      }
      return acc
    }, {})

    // converting single score operators to double score operators for soul-cli compatibility
    params.filter = Object.keys(params.filter).reduce((acc: any, key) => {
      const foundOperator = operators.find((operator) => key.includes(operator))
      if (foundOperator) {
        const modifiedKey = key.replace(
          foundOperator,
          `__${foundOperator.slice(1)}`
        )
        acc[modifiedKey] = params.filter[key]
      } else {
        acc[key] = params.filter[key]
      }

      return acc
    }, {})

    const filter = JSON.stringify(params.filter).replace(/[{} ""]/g, '')
    const query = {
      _page: page,
      _limit: perPage,
      _ordering: field !== 'id' ? ordering : undefined,
      _filters: filter ? `${filter},${params.target}:${params.id}` : undefined
    }

    const url = `${apiUrl}/${resource}/rows?${JSON.stringify(query)}`

    return await axios
      .get(url)
      .then((response) => {
        const { data } = response.data

        return { data, total: response.data.total }
      })
      .catch(async (err) => {
        const { message, status, data } = getErrorDetails(err) ?? {}
        return await Promise.reject(new HttpError(message, status, data))
      })
  },

  create: async (resource: string, params: any) => {
    const url = `${apiUrl}/${resource}/rows`

    params.data = Object.keys(params.data).reduce((acc: any, key) => {
      if (typeof params.data[key] === 'boolean') {
        acc[key] = params.data[key] ? 1 : 0
      } else {
        acc[key] = params.data[key]
      }
      return acc
    }, {})

    return await axios
      .post(url, { fields: params.data })
      .then((response) => {
        return {
          data: { id: response.data.data.lastInsertRowid, ...params.data }
        }
      })
      .catch(async (err) => {
        const { message, status, data } = getErrorDetails(err) ?? {}
        return await Promise.reject(new HttpError(message, status, data))
      })
  },

  update: async (resource: string, params: any) => {
    const url = `${apiUrl}/${resource}/rows/${params.id}`
    const editData = Object.keys(params.data).reduce((acc: any, key) => {
      acc[key] = sanitizeCode(params.data[key])
      return acc
    }, {})
    // remove the id property
    return await axios
      .put(url, { fields: editData })
      .then(() => {
        return {
          data: { id: params.id, ...params.data }
        }
      })
      .catch(async (err) => {
        const { message, status, data } = getErrorDetails(err) ?? {}
        return await Promise.reject(new HttpError(message, status, data))
      })
  },

  updateMany: async (resource: string, params: any) => {
    const url = `${apiUrl}/${resource}/rows/${params.ids.toString()}`

    const { id, ...editData } = Object.keys(params.data).reduce(
      (acc: any, key) => {
        acc[key] = sanitizeCode(params.data[key])
        return acc
      },
      {}
    )
    // remove the id property
    return await axios
      .put(url, { fields: editData })
      .then(async () => {
        return { data: params.ids }
      })
      .catch(async (err) => {
        const { message, status, data } = getErrorDetails(err) ?? {}
        return await Promise.reject(new HttpError(message, status, data))
      })
  },
  // Note: Deletion is not supported (except for bridging tables)
  delete: async (resource: string, params: any) => {
    if (bridgingTables.includes(resource)) {
      const url = `${apiUrl}/${resource}/rows/${params.id}`
      return await axios.delete(url).then(() => ({ data: params.id }))
    } else {
      throw new Error('Deletion is not supported!')
    }
  },

  // Note: Deletion is not supported (except for bridging tables)
  deleteMany: async (resource: string, params: any) => {
    if (bridgingTables.includes(resource)) {
      const ids = params.ids.toString()
      const url = `${apiUrl}/${resource}/rows/${ids}`
      return await axios.delete(url).then(() => {
        return { data: params.ids }
      })
    } else {
      throw new Error('Deletion is not supported!')
    }
  }
})
