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
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { ConditionalReferenceInput } from '../batches/BatchForm'
import { generateReference } from '../../providers/dataProvider/dataprovider-utils'
import { Typography } from '@mui/material'

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
  const [name, setName] = useState<string | null>(null)
  const createPath = useCreatePath()
  const redirect = useRedirect()
  const notify = useNotify()
  const [update] = useUpdate()

  const getName = async (): Promise<string> => {
    const name = await generateReference<Destruction>(
      dataProvider,
      new Date().getFullYear().toString(),
      constants.R_DESTRUCTION,
      'name',
      undefined,
      'VAULT',
      0
    )
    return name
  }

  useEffect(() => {
    getName().then(setName).catch(console.log)
  }, [])

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
    const { remarks, vault } = data
    try {
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
  const pageTitle = isEdit ? 'Edit Destruction' : 'Add new Destruction'
  return (
    <SimpleForm
      toolbar={<DestructionFormToolbar isEdit={isEdit} />}
      resolver={yupResolver(schema)}
      onSubmit={handleSubmit as any}>
      <Typography variant='h6' fontWeight='bold'>
        {pageTitle}
      </Typography>
      {isEdit && (
        <TextInput
          fullWidth
          disabled={disabledFields.includes('name')}
          source='name'
          label='Reference'
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
