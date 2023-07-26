import { useEffect } from 'react'
import useItemList from '../../hooks/useItemList'
import { type Identifier } from 'react-admin'

export interface DataType {
  users: Record<Identifier, User>
  vaultLocations: Record<Identifier, VaultLocation>
}

interface Props {
  setData: React.Dispatch<DataType>
}

export default function ItemListData(props: Props): React.ReactElement {
  const { setData } = props
  const data = useItemList()
  useEffect(() => {
    setData(data)
  }, [data])
  return <></>
}
