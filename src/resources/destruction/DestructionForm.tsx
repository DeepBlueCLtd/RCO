import React, { useEffect, useState } from 'react'
import {
  SaveButton,
  SimpleForm,
  TextInput,
  Toolbar,
  useCreate,
  useCreatePath,
  useDataProvider,
  useNotify,
  useRedirect,
  useUpdate
} from 'react-admin'
import * as constants from '../../constants'
import DatePicker from '../../components/DatePicker'
import TextFields from '@mui/material/TextField'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'

interface Props {
  isEdit?: boolean
  disabledFields?: string[]
}

const schema = yup.object({
  remarks: yup.string()
})

interface DestructionFormToolbarProps {
  isEdit: boolean
}

const DestructionFormToolbar = (
  props: DestructionFormToolbarProps
): React.ReactElement => {
  const { isEdit } = props

  return (
    <Toolbar>
      <SaveButton label={isEdit ? 'Save' : 'Create'} />
    </Toolbar>
  )
}

export default function DestructionForm(props: Props): React.ReactElement {
  const { isEdit = false, disabledFields = [] } = props
  const dataProvider = useDataProvider()
  const [create] = useCreate()
  const [loading, setLoading] = useState(!isEdit)
  const [lastId, setLastId] = useState<number>(0)
  const [year, setYear] = useState(new Date().getFullYear())
  const createPath = useCreatePath()
  const redirect = useRedirect()
  const notify = useNotify()
  const [update] = useUpdate()

  const getName = (lastId: number, year: number): string => {
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
          const lastDataId: number = data[0]?.id
          const id: number =
            lastDataId === undefined ? 0 : lastDataId === 0 ? 1 : lastDataId + 1
          setLastId(id)
        })
        .catch(console.log)
        .finally(() => {
          setLoading(false)
        })
    }
  }, [isEdit])

  const onSuccess = (id?: number): void => {
    redirect(
      createPath({
        resource: constants.R_DESTRUCTION,
        type: 'show',
        id: id ?? lastId
      })
    )
  }

  const onSubmit = async (data: any): Promise<void> => {
    const { remarks } = data
    try {
      const name = getName(lastId, year)
      await create(
        constants.R_DESTRUCTION,
        {
          data: { name, remarks }
        },
        {
          onSuccess: () => {
            notify('Element created')
            onSuccess()
          }
        }
      )
    } catch (error: any) {
      notify(error.message, { type: 'error' })
    }
  }

  if (typeof loading !== 'undefined' && loading) return <></>

  const name = getName(lastId, year)

  const updateJob = async (data: Destruction): Promise<void> => {
    await update(
      constants.R_DESTRUCTION,
      {
        id: data.id,
        data
      },
      {
        onSuccess: () => {
          notify('Element updated')
          onSuccess(data.id)
        }
      }
    )
  }
  const handleSubmit = isEdit ? updateJob : onSubmit

  return (
    <SimpleForm
      toolbar={<DestructionFormToolbar isEdit={isEdit} />}
      resolver={yupResolver(schema)}
      onSubmit={handleSubmit as any}>
      <DatePicker
        label='Year'
        source='year'
        variant='outlined'
        format='YYYY'
        onChange={setYear}
        dataPickerProps={{
          views: ['year'],
          disabled: disabledFields.includes('year')
        }}
      />
      <TextFields
        fullWidth
        value={name}
        label='Reference'
        disabled={disabledFields.includes('name')}
      />
      <TextInput sx={{ width: '100%' }} source='remarks' />
    </SimpleForm>
  )
}
