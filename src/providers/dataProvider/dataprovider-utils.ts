import { type UpdateParams, type CreateResult, type RaRecord } from 'ra-core'
import { DateTime } from 'luxon'
import { AuditType } from '../../utils/activity-types'
import { isSameDate } from '../../utils/date'
import { getUser } from '../authProvider'
import { type ResourceTypes } from '../../constants'
import {
  type ResourceCallbacks,
  type DataProvider,
  type GetListParams
} from 'react-admin'
import ReferenceItemLifeCycle from './resource-callbacks/ReferenceItemLifeCycle'
import { isNumber } from '../../utils/number'
import { type AuditData } from '../../utils/audit'

export const nowDate = (): string => {
  const isoDate = DateTime.utc().toISO()
  return isoDate !== null ? isoDate : 'n/a'
}

export const getDifference = (
  data: Record<string, any>,
  previousData: Record<string, any>
): Record<any, string | null> => {
  const valuesChanged: Record<string, any> = {}
  Object.keys(data).forEach((item) => {
    const isDateModified =
      data[item] instanceof Date && !isSameDate(data[item], previousData[item])
    if (
      isDateModified ||
      (typeof data[item] !== 'object' &&
        data[item] !== previousData[item] &&
        item !== 'password')
    ) {
      valuesChanged[item] = previousData[item]
    }
  })
  return valuesChanged
}

interface AuditDataArgs {
  activityType: AuditType
  securityRelated?: boolean
}

export type AuditFunctionType = ({
  activityType,
  activityDetail,
  securityRelated,
  resource,
  dataId,
  subjectId,
  subjectResource
}: AuditData) => Promise<void>

const getActivityDetail = (
  difference: Record<string, any>,
  editRemarks: Record<string, any>
): string => {
  const stringify = (data: any): string =>
    JSON.stringify(data).replace(/"/g, '\\"')

  const activityDetail = `{"Previous values": ${stringify(difference)}${
    editRemarks ? `, "Remarks": ${stringify(editRemarks)}` : ''
  }}`

  return activityDetail
}

export const auditForUpdatedChanges = async (
  record: UpdateParams<RCOResource>,
  resource: ResourceTypes,
  auditData: AuditDataArgs,
  audit: AuditFunctionType
): Promise<UpdateParams<RCOResource>> => {
  // @ts-expect-error: property not found in type
  const { editRemarks, prevProtectionValues = {}, ...rest } = record.data
  if (editRemarks || prevProtectionValues) {
    record.data = rest
  }
  const { protectionString, ...difference } = getDifference(
    record.data,
    record.previousData
  )

  const keys = Object.keys(difference)
  const testKeys: string[] = [
    'dispatchedAt',
    'reportPrintedAt',
    'lastHastenerSent',
    'receiptReceived'
  ]
  testKeys.forEach((key) => {
    if (keys.includes(key) && !difference?.[key]) {
      difference[key] = 'unset'
    }
  })

  const dataId =
    record.previousData.id !== undefined ? record.previousData.id : null

  if (Object.keys(prevProtectionValues).length > 0) {
    const activityDetail = getActivityDetail(prevProtectionValues, editRemarks)
    await audit({
      activityDetail,
      resource,
      securityRelated: true,
      dataId,
      activityType: AuditType.EDIT,
      subjectId: null,
      subjectResource: null
    })
  }

  if (
    Object.keys(difference).length > 0 ||
    auditData.activityType === AuditType.PASSWORD_RESET
  ) {
    const activityDetail = getActivityDetail(difference, editRemarks)
    await audit({
      activityDetail,
      resource,
      dataId,
      subjectId: null,
      subjectResource: null,
      securityRelated: null,
      ...auditData
    })
  }
  return record
}

export const convertDateToISO = <T>(
  record: Partial<Record<keyof T, any>>,
  keys: Array<keyof T>
): Partial<T> => {
  keys.forEach((key) => {
    if (typeof record[key] !== 'undefined' && record[key] !== null) {
      record[key] = new Date(record[key]).toISOString()
    }
  })
  return record
}
/** utility method to initialise the created by and created at fields */
export const withCreatedByAt = (
  record: CreateResult<ResourceWithCreation>
): CreateResult<ResourceWithCreation> => {
  const user = getUser()
  if (user !== undefined) {
    record.data.createdBy = user.id
  }
  record.data.createdAt = nowDate()
  return record
}

export const extendLifeCycle = (
  resource: ResourceTypes,
  audit: AuditFunctionType,
  securityRelated?: (record: UpdateParams<RCOResource>) => boolean,
  callbacks?: Omit<ResourceCallbacks, 'resource'>
): ResourceCallbacks<any> => ({
  ...ReferenceItemLifeCycle(audit, resource, securityRelated),
  ...callbacks
})

export async function generateReference<T extends RaRecord>(
  provider: DataProvider,
  year: string,
  resource: ResourceTypes,
  fieldName: keyof T,
  filter: GetListParams['filter'] = {
    createdAt_gte: DateTime.now().startOf('year').toISO()
  },
  prefix = 'VAULT',
  index = 1
): Promise<string> {
  if (!isNumber(year)) throw new TypeError('Year invalid')
  const dispatch = await provider.getList<T>(resource, {
    sort: { field: 'id', order: 'DESC' },
    pagination: { page: 1, perPage: 2 },
    filter: { ...filter }
  })
  const currentYear = parseInt(year)
  const lastDispatch = dispatch.data[index]
  const lastDispatchName = lastDispatch[fieldName] as string
  const generatedYear = parseInt(lastDispatchName.slice(-4))
  const counter =
    generatedYear < currentYear
      ? 1
      : parseInt(lastDispatchName.split('/')[1]) + 1

  return `${prefix}/${counter}/${currentYear}`
}
