import { useListContext, useStore, useUnselectAll } from 'react-admin'
import { useEffect } from 'react'

const useLocalStore = (storeKey: string, resource: string): void => {
  const [value, setValue] = useStore(storeKey)

  const { selectedIds, onSelect } = useListContext()

  const unSelectAll = useUnselectAll(resource)

  useEffect(() => {
    unSelectAll()
    onSelect(value)
    return () => {
      unSelectAll()
    }
  }, [])

  useEffect(() => {
    setValue(selectedIds)
  }, [selectedIds.length])
}

export default useLocalStore
