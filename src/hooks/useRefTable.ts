import {
  useCreate,
  useDataProvider,
  useRedirect
  // useDeleteMany,
} from 'react-admin'
import * as constants from '../constants'

interface DBMethods {
  createRecord: (id: number, data?: number[]) => void
  updateRecord: (id: number, data?: number[]) => Promise<unknown>
}

export default function useRefTable(
  refTable: string,
  source: string,
  resource: string
): DBMethods {
  const [create] = useCreate()
  // const [deleteMany] = useDeleteMany()
  const dataProvider = useDataProvider()
  const redirect = useRedirect()

  const updateRecord = async (
    id: number,
    data?: number[]
  ): Promise<unknown> => {
    return await new Promise((resolve, reject): void => {
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
          if (idsToDelete.length > 0) {
            dataProvider
              .deleteMany(refTable, { ids: idsToDelete })
              .then(() => {
                createRecord(id, data)
                resolve(null)
              })
              .catch((err) => {
                reject(err)
              })
          } else {
            createRecord(id, data)
            resolve(null)
          }
        })
        .catch((err) => {
          reject(err)
        })
    })
  }

  const createRecord = (id: number, data?: number[]): void => {
    try {
      data?.map(async (sId: number) => {
        return await create(refTable, {
          data: {
            [source]: sId,
            [resource]: id
          }
        })
      })
      if (resource !== constants.R_ITEMS) redirect(`/${resource}`)
    } catch (error: any) {
      console.log(error)
    }
  }

  return {
    createRecord,
    updateRecord
  }
}
