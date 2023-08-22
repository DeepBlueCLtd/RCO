import * as constants from '../constants'
import { type Identifier, useListContext, useDataProvider } from 'react-admin'
import { useEffect, useState } from 'react'

interface UseItemList {
  users: Record<Identifier, User> | null
  vaultLocations: Record<Identifier, VaultLocation> | null
}

export default function useItemList(): UseItemList {
  const [userIds, setUserIds] = useState<number[]>([])
  const [vLocationsIds, setVLocationsIds] = useState<number[]>([])
  const [users, setUsers] = useState<Record<Identifier, User> | null>(null)
  const [vaultLocations, setVaultLocations] = useState<Record<
    Identifier,
    VaultLocation
  > | null>(null)
  const dataProvider = useDataProvider()

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

  useEffect(() => {
    getData()

    return () => {
      setUserIds([])
      setVLocationsIds([])
    }
  }, [data])

  useEffect(() => {
    const getUserData = async (): Promise<void> => {
      const { data = [] } = await dataProvider.getMany<User>(
        constants.R_USERS,
        {
          ids: userIds
        }
      )

      setUsers(() => {
        const result: Record<Identifier, User> = {}
        data.forEach((record) => {
          result[record.id] = record
        })
        return result
      })
    }
    getUserData().catch(console.log)

    return () => {
      setUsers(null)
    }
  }, [userIds])

  useEffect(() => {
    const getVLocationData = async (): Promise<void> => {
      const { data = [] } = await dataProvider.getMany(
        constants.R_VAULT_LOCATION,
        {
          ids: vLocationsIds
        }
      )

      setVaultLocations(() => {
        const result: Record<Identifier, VaultLocation> = {}
        data.forEach((record) => {
          result[record.id] = record
        })
        return result
      })
    }

    getVLocationData().catch(console.log)

    return () => {
      setVaultLocations(null)
    }
  }, [vLocationsIds])

  return {
    users,
    vaultLocations
  }
}
