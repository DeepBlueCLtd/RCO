import {
  useCreate,
  useDeleteMany,
  useGetList,
  useRecordContext,
  useRedirect,
  useUpdate
} from 'react-admin'
import { useFormContext } from 'react-hook-form'
import * as constants from '../constants'
import { useParams } from 'react-router-dom'

interface DBMethods {
  createRecord: (ev: React.MouseEvent<HTMLElement>) => Promise<void>
  updateRecord: (ev: React.MouseEvent<HTMLElement>) => Promise<void>
}

export default function useCatCaveDB(): DBMethods {
  const { getValues } = useFormContext()
  const [create] = useCreate()
  const [update] = useUpdate()
  const [deleteMany] = useDeleteMany()
  const redirect = useRedirect()
  const { id } = useParams()
  const record = useRecordContext()

  const { data: catCaves } = useGetList(constants.R_ITEMS_CAT_CAVE, {
    filter: {
      item: record?.id
    }
  })

  const { data: itemsList } = useGetList(constants.R_ITEMS, {
    sort: { field: 'id', order: 'DSC' },
    pagination: {
      page: 1,
      perPage: 1
    }
  })

  const updateRecord = async (
    ev: React.MouseEvent<HTMLElement>
  ): Promise<void> => {
    ev.preventDefault()

    const { catCave: newCatCaves, ...data } = getValues()

    await update(constants.R_ITEMS, {
      id,
      data,
      previousData: record
    })

    const idsToDelete = catCaves
      ?.filter(
        (item: Record<string, any>) => !newCatCaves.includes(item.catCave)
      )
      .map((item) => item.id)

    const savedCatCaveIds = catCaves?.map((item) => item.id)

    const idsToCreate = newCatCaves?.filter(
      (id: number) => !savedCatCaveIds?.includes(id)
    )

    await deleteMany(constants.R_ITEMS_CAT_CAVE, { ids: idsToDelete })

    idsToCreate.map(async (catCave: number) => {
      await create(constants.R_ITEMS_CAT_CAVE, {
        data: {
          catCave,
          item: id
        }
      })
    })

    redirect('/item')
  }

  const createRecord = async (
    ev: React.MouseEvent<HTMLElement>
  ): Promise<void> => {
    ev.preventDefault()
    const { catCave, ...data } = getValues()
    console.log(data)
    create(constants.R_ITEMS, { data })
      .then(() => {
        const { id: lastId } = itemsList?.[0]
        if (lastId) {
          catCave.forEach((id: number) => {
            create(constants.R_ITEMS_CAT_CAVE, {
              data: {
                catCave: id,
                item: parseInt(lastId) + 1
              }
            }) as any
          })
        }
      })
      .catch(console.log)
  }

  return {
    createRecord,
    updateRecord
  }
}
