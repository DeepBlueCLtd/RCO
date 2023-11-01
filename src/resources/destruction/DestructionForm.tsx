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
import { ConditionalReferenceInput } from '../batches/BatchForm'

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
      <SaveButton label={isEdit ? 'Save' : 'Create'} alwaysEnable />
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
  const [lastDestruction, setLastDestruction] = useState<null | Destruction>(
    null
  )

  const getName = (lastId: number): string => {
    if (!lastDestruction) {
      return `DC/1/${year}`
    }

    const lastDestructionName = lastDestruction.name
    if (!lastDestructionName) {
      console.error('Should not have missing destruction name at this point')
      return 'Pending'
    } else {
      const lastDestructionYear = parseInt(lastDestructionName.split('/')[2])

      let id = lastId
      if (lastDestructionYear < year) {
        id = 1
      } else {
        const lastReferenceNumber = parseInt(lastDestructionName.split('/')[1])
        id = lastReferenceNumber + 1
      }

      return `DC/${id}/${year}`
    }
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

  useEffect(() => {
    dataProvider
      .getList<Destruction>(constants.R_DESTRUCTION, {
        sort: { field: 'id', order: 'DESC' },
        pagination: { perPage: 1, page: 1 },
        filter: {}
      })
      .then(({ data }) => {
        setLastDestruction(data[0])
      })
      .catch(console.log)
  }, [])

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
    const { remarks, vault } = data
    try {
      const name = getName(lastId)
      const newD: Omit<Destruction, 'id' | 'createdAt' | 'createdBy'> = {
        name,
        remarks,
        finalisedAt: null,
        finalisedBy: null,
        reportPrintedAt: null,
        vault
      }
      await create(
        constants.R_DESTRUCTION,
        {
          data: newD
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

  const name = getName(lastId)

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
      {isEdit ? (
        <TextInput
          fullWidth
          disabled={disabledFields.includes('name')}
          source='name'
          label='Reference'
        />
      ) : (
        <TextFields
          fullWidth
          value={name}
          label='Reference'
          disabled={disabledFields.includes('name')}
        />
      )}
      <ConditionalReferenceInput
        source='vault'
        reference={constants.R_VAULT}
        isEdit={isEdit}
      />
      <TextInput sx={{ width: '100%' }} source='remarks' />
    </SimpleForm>
  )
}
