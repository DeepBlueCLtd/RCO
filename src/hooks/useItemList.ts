import useRecords from './useRecord'
import * as constants from '../constants'
import { type Identifier, useListContext } from 'react-admin'
import { useEffect, useState } from 'react'

interface UseItemList {
  users: Record<Identifier, User>
  vaultLocations: Record<Identifier, VaultLocation>
}

export default function useItemList(): UseItemList {
  const [userIds, setUserIds] = useState<number[]>([])
  const [vLocationsIds, setVLocationsIds] = useState<number[]>([])
  const { data: users } = useRecords<User>(constants.R_USERS, userIds)
  const { data: vaultLocations } = useRecords<VaultLocation>(
    constants.R_VAULT_LOCATION,
    vLocationsIds
  )
  const { data } = useListContext()

  const getData = (): void => {
    const uids: number[] = []
    const vlocations: number[] = []
    data?.forEach((record: Item) => {
      const { loanedTo, vaultLocation } = record
      if (typeof loanedTo !== 'undefined' && loanedTo) {
        uids.push(loanedTo)
      }
      if (typeof vaultLocation !== 'undefined' && vaultLocation) {
        vlocations.push(vaultLocation)
      }
    })
    setUserIds(uids)
    setVLocationsIds(vlocations)
  }

  useEffect(getData, [data])

  return {
    users,
    vaultLocations
  }
}
