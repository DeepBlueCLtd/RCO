import { type ResourceTypes } from '../constants'
import { useListContext } from 'react-admin'

const useRowClick = (resource: ResourceTypes): ((id: number) => false) => {
  const { onSelect, selectedIds } = useListContext(resource)
  const handleClick = (id: number): false => {
    const idNums = selectedIds as number[]
    if (idNums.includes(id)) {
      onSelect(idNums.filter((selectedId) => selectedId !== id))
    } else {
      onSelect([...idNums, id])
    }
    return false
  }

  return handleClick
}

export default useRowClick
