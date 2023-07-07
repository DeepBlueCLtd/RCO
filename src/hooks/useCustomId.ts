import { useFormContext } from 'react-hook-form'
import { ID_POSTPREFIX } from '../constants'
import {
  useCreate,
  useCreatePath,
  useGetList,
  useRedirect,
  useResourceContext
} from 'react-admin'

type UseCustomId = (event: React.SyntheticEvent) => void

export default function useCustomid(): UseCustomId {
  const { getValues } = useFormContext()
  const [create] = useCreate() as any
  const resource = useResourceContext()
  const { total = 0 } = useGetList(resource, {
    sort: { field: 'id', order: 'DESC' },
    pagination: { page: 1, perPage: 1 }
  })
  const createPath = useCreatePath()
  const redirect = useRedirect()

  const createRecord = (ev: React.SyntheticEvent): void => {
    ev.preventDefault()
    const values = getValues()

    const preFix = ID_POSTPREFIX?.[resource]
    const totalItems: number = total
    const recordNumber = totalItems + 1
    const id =
      typeof preFix !== 'undefined' ? `${preFix}-${recordNumber}` : recordNumber

    const data = { id, ...values }

    const onSettled = (): void => {
      const path = createPath({ resource, type: 'list' })
      redirect(path)
    }

    create(resource, { data }, { onSettled, onError: console.error })
  }

  return createRecord
}
