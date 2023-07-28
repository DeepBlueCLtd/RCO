import { useEffect, useState } from 'react'
import { type ResourceTypes } from '../constants'
import { useDataProvider, type RaRecord, type Identifier } from 'react-admin'

interface UseRecord<T> {
  data: Record<Identifier, T>
  loading: boolean
}

export default function useRecord<T extends RaRecord>(
  resource: ResourceTypes,
  ids: number[]
): UseRecord<T> {
  const dataProvider = useDataProvider()
  const [loading, setLoading] = useState(false)
  const [data, setData] = useState<Record<Identifier, T>>({})

  const getData = async (): Promise<void> => {
    try {
      setLoading(false)
      const { data = [] } = await dataProvider.getMany<T>(resource, { ids })
      setData((result) => {
        data.forEach((record) => {
          result[record.id] = record
        })
        return result
      })
    } catch (error) {
      console.log(error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (ids.length !== 0) {
      getData() as any
    }
  }, [ids])

  return { data, loading }
}
