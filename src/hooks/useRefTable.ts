import {
  useCreate,
  useDataProvider,
  useDeleteMany,
  useRedirect
} from 'react-admin'

interface DBMethods {
  createRecord: (id: number, data?: number[]) => void
  updateRecord: (id: number, data?: number[]) => void
}

export default function useRefTable(
  refTable: string,
  source: string,
  resource: string
): DBMethods {
  const [create] = useCreate()
  const [deleteMany] = useDeleteMany()
  const redirect = useRedirect()
  const dataProvider = useDataProvider()

  const updateRecord = (id: number, data?: number[]): void => {
    dataProvider
      .getList(refTable, {
        pagination: { page: 1, perPage: 100 },
        sort: { field: 'id', order: 'ASC' },
        filter: { [resource]: id }
      })
      .then(({ data: tableData = [] }) => {
        const idsToDelete = tableData.map(
          (item: Record<string, any>) => item.id
        )
        deleteMany(refTable, { ids: idsToDelete })
          .then(() => { createRecord(id, data) })
          .catch(console.log)
      })
      .catch(console.log)
  }

  const createRecord = (id: number, data?: number[]): void => {
    const promiseArray = data?.map(async (sId: number) => {
      return await create(refTable, {
        data: {
          [source]: sId,
          [resource]: id
        }
      })
    })
    Promise.allSettled(promiseArray ?? [])
      .then(() => { redirect(`/${resource}`) })
      .catch(console.log)
  }

  return {
    createRecord,
    updateRecord
  }
}
