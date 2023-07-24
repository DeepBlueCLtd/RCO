import { AuditType } from '../utils/activity-types'
import useAudit from './useAudit'
import * as constants from '../constants'
import { useDataProvider, useListContext, useRecordContext } from 'react-admin'
import { useParams } from 'react-router-dom'

type UseVaultLocationAudit = (
  vaultLocationId: number,
  itemId?: number | undefined
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
    const allItems: Item[] = data?.length > 0 ? data : record ? [record] : []
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
    id?: number
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
      type: AuditType.EDIT,
      securityRelated: false
    }

    const allAudits = async (itemId: number): Promise<void> => {
      const itemRef = selectedItems[itemId]?.item_number
      const itemAudit = {
        ...auditData,
        resource: constants.R_ITEMS,
        dataId: itemId
      }
      const audits = [
        {
          ...itemAudit,
          activityDetail: `Vault Location changed to ${vaultLocation?.name}`
        },
        {
          ...itemAudit,
          activityDetail: `item added to VaultLocation ${vaultLocation?.name}`
        },
        {
          ...auditData,
          activityDetail: `item ${itemRef} added to VaultLocation`,
          resource: constants.R_VAULT_LOCATION,
          dataId: vaultLocationId
        }
      ]
      if (!id) {
        audits.push(
          ...[
            {
              ...itemAudit,
              activityDetail: `item Removed from ${
                vaultLocations?.[selectedItems[itemId]?.vaultLocation].name
              }`
            },
            {
              ...auditData,
              activityDetail: `item ${itemRef} removed from previous VaultLocation`,
              resource: constants.R_VAULT_LOCATION,
              dataId: selectedItems[itemId]?.vaultLocation
            }
          ]
        )
      }
      audits.map(async (auditData) => {
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
