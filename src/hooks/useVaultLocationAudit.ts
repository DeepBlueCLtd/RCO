import { AuditType } from '../utils/activity-types'
import useAudit from './useAudit'
import * as constants from '../constants'
import { useDataProvider, useListContext, useRecordContext } from 'react-admin'
import { useParams } from 'react-router-dom'
import { type AuditData } from '../utils/audit'

type UseVaultLocationAudit = (
  vaultLocationId: number,
  itemId?: number | undefined,
  editRemarks?: string
) => Promise<void>

export default function useVaultLocationAudit(): UseVaultLocationAudit {
  const audit = useAudit()
  const dataProvider = useDataProvider()
  const { selectedIds, data = [] } = useListContext<Item>()
  const record = useRecordContext<Item>()
  const { id } = useParams()
  const ids = id ? [parseInt(id)] : selectedIds

  const getItemsByIds = async (
    vaultLocationId: number,
    newId?: number
  ): Promise<Record<Item['id'], Item>> => {
    const items: Record<Item['id'], Item> = {}
    const fromRecord = record ? [record] : []
    const allItems: Item[] = data?.length > 0 ? data : fromRecord
    if (newId) {
      const { data } = await dataProvider.getOne<Item>(constants.R_ITEMS, {
        id: newId
      })
      allItems.push(data)
    }
    allItems.forEach((item) => {
      const { id, vaultLocation } = item
      if (newId ?? vaultLocation !== vaultLocationId) {
        items[id] = item
      }
    })
    return items
  }

  const getVLocationByIds = async (
    ids: number[]
  ): Promise<Record<VaultLocation['id'], VaultLocation>> => {
    const { data = [] } = await dataProvider.getMany<VaultLocation>(
      constants.R_VAULT_LOCATION,
      {
        ids
      }
    )
    const vaultLocations: Record<VaultLocation['id'], VaultLocation> = {}
    data.forEach((vl: VaultLocation) => {
      const { id } = vl
      vaultLocations[id] = vl
    })
    return vaultLocations
  }

  const auditLocations = async (
    vaultLocationId: number,
    id?: number,
    editRemarks?: string
  ): Promise<void> => {
    const newIds = id ? [id] : ids
    if (newIds.length === 0) return
    const { data: vaultLocation } = await dataProvider.getOne<VaultLocation>(
      constants.R_VAULT_LOCATION,
      {
        id: vaultLocationId
      }
    )

    const selectedItems = await getItemsByIds(vaultLocationId, id)

    if (Object.keys(selectedItems).length === 0) return

    const selectedVIds = newIds.map(
      (id: number) => selectedItems?.[id].vaultLocation
    )
    const vaultLocations = await getVLocationByIds(selectedVIds)

    const auditData = {
      activityType: AuditType.MOVED,
      securityRelated: false,
      subjectId: null,
      subjectResource: null
    }

    const allAudits = async (itemId: number): Promise<any> => {
      const itemRef = selectedItems[itemId]?.itemNumber
      const itemAudit: AuditData = {
        ...auditData,
        resource: constants.R_ITEMS,
        dataId: itemId,
        activityDetail: null,
        subjectId: vaultLocationId,
        subjectResource: constants.R_VAULT_LOCATION
        // TODO: TAHA - we should includeh the VAULT LOCATION id and R_VAULT_LOCATIONS for this.
      }
      const audits: AuditData[] = []
      // log removal first
      if (!id) {
        // TODO: TAHA - for `itemAudit` the subject should be the OLD vault lcoation, and for
        // TODO: `auditData` the subject should be the item

        audits.push(
          ...[
            {
              ...itemAudit,
              activityDetail: `Removed from ${
                vaultLocations?.[selectedItems[itemId]?.vaultLocation].name
              } ${editRemarks !== undefined ? `Remarks: ${editRemarks}` : ''}`,
              subjectId:
                vaultLocations?.[selectedItems[itemId]?.vaultLocation]?.id,
              subjectResource: constants.R_VAULT_LOCATION
            },
            {
              ...auditData,
              activityDetail: `${itemRef} removed`,
              resource: constants.R_VAULT_LOCATION,
              dataId: selectedItems[itemId]?.vaultLocation,
              subjectResource: constants.R_ITEMS,
              subjectId: itemId
            }
          ]
        )
      }
      // now log putting in new locaiton
      // TODO: TAHA - for `itemAudit` the subject should be the NEW vault lcoation, and for
      // TODO: `auditData` the subject should be the item
      audits.push(
        ...[
          {
            ...itemAudit,
            activityDetail: `Moved to ${vaultLocation?.name}`,
            subjectId: vaultLocation?.id,
            subjectResource: constants.R_VAULT_LOCATION
          },
          {
            ...auditData,
            activityDetail: `${itemRef} added`,
            resource: constants.R_VAULT_LOCATION,
            dataId: vaultLocationId,
            subjectId: itemId,
            subjectResource: constants.R_ITEMS
          }
        ]
      )

      return audits.map(async (auditData) => {
        if (auditData) {
          await audit(auditData)
        }
      })
    }
    const promises = newIds.map(allAudits)
    await Promise.all(promises)
  }

  return auditLocations
}
