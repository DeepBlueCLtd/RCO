import { type Theme } from '@mui/material'
import React from 'react'
import {
  Create,
  Edit,
  FunctionField,
  ShowButton,
  Show,
  TopToolbar,
  useRedirect
} from 'react-admin'
import BatchForm from './BatchForm'
import * as constants from '../../constants'

const BatchList = React.lazy(async () => await import('./BatchList'))
const BatchShow = React.lazy(async () => await import('./BatchShow'))

const BatchCreate = (): React.ReactElement => {
  const redirect = useRedirect()
  return (
    <Create
      mutationOptions={{
        onSuccess: (d: { batchNumber: string; id: number }): void => {
          redirect(`/${constants.R_BATCHES}/${d?.id}/show`)
        }
      }}>
      <BatchForm />
    </Create>
  )
}

const Actions = (): React.ReactElement => {
  return (
    <TopToolbar>
      <Show sx={{ marginRight: 'auto' }} actions={false}>
        <FunctionField<Batch>
          source='batchNumber'
          render={(record) => record?.batchNumber}
          sx={(theme: Theme) => ({
            width: '150px',
            fontWeight: 'bold',
            height: '35px',
            display: 'flex',
            alignItems: 'center',
            padding: '16px',
            background: theme.palette.primary.main,
            justifyContent: 'center',
            color: theme.palette.common.white
          })}
        />
      </Show>
      <ShowButton />
    </TopToolbar>
  )
}

const BatchEdit = (): React.ReactElement => {
  return (
    <Edit actions={<Actions />} mutationMode='pessimistic'>
      <BatchForm isEdit />
    </Edit>
  )
}

const batches: ResourceRoutes = {
  create: BatchCreate,
  edit: BatchEdit,
  list: BatchList,
  show: BatchShow
}

export default batches
