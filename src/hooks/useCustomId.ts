import { useFormContext } from 'react-hook-form'
import { ID_FIX } from '../constants'
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
  const {data : existingRcordes} = useGetList(resource, {
    sort: {field: 'id', order: "DESC"},
    pagination: {page: 1, perPage: 1}
  })
  const createPath = useCreatePath()
  const redirect = useRedirect()

  const createRecord = (ev: React.SyntheticEvent): void => {
    ev.preventDefault()
    const values = getValues()

    const preFix = ID_FIX?.[resource]
    const highestId = existingRcordes?.[0]?.id || 0;
    const id =
      typeof preFix !== 'undefined' ? `${preFix}-${highestId + 1}` : highestId + 1

    const data = { id, ...values }

    const onSettled = (): void => {
      const path = createPath({ resource, type: 'list' })
      redirect(path)
    }

    create(resource, { data }, { onSettled, onError: console.error })
  }

  return createRecord
}
