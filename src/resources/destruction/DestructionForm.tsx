import { useEffect, useState } from 'react'
import { SimpleForm, useCreate, useDataProvider, useNotify } from 'react-admin'
import * as constants from '../../constants'
import DatePicker from '../../components/DatePicker'
import TextFields from '@mui/material/TextField'

interface Props {
  isEdit?: boolean
}

export default function DestructionForm(props: Props): React.ReactElement {
  const { isEdit = false } = props
  const dataProvider = useDataProvider()
  const [create] = useCreate()
  const [loading, setLoading] = useState(!isEdit)
  const [lastId, setLastId] = useState(0)
  const [year, setYear] = useState(new Date().getFullYear())
  const notify = useNotify()

  const getReference = (lastId: number, year: number): string => {
    const id = lastId + 1
    return `DC/V/${id}/${year}`
  }

  useEffect(() => {
    if (typeof loading === 'boolean' && loading) {
      dataProvider
        .getList<Destruction>(constants.R_DESTRUCTION, {
          filter: {},
          sort: { field: 'id', order: 'DESC' },
          pagination: { page: 1, perPage: 1 }
        })
        .then(({ data }) => {
          setLastId(data[0]?.id ?? 0)
        })
        .catch(console.log)
        .finally(() => {
          setLoading(false)
        })
    }
  }, [isEdit])

  const reference = getReference(lastId, year)

  const onSubmit = async (): Promise<void> => {
    try {
      await create(constants.R_DESTRUCTION, {
        data: { reference }
      })
      notify('Element created')
    } catch (error: any) {
      notify(error.message, { type: 'error' })
    }
  }

  if (loading) return <></>

  return (
    <SimpleForm onSubmit={onSubmit}>
      <DatePicker
        label='Year'
        source='year'
        variant='outlined'
        format='YYYY'
        onChange={setYear}
        dataPickerProps={{ views: ['year'] }}
      />
      <TextFields fullWidth value={reference} label='Reference' />
    </SimpleForm>
  )
}
