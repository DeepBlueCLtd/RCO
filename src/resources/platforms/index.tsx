import React from 'react'
import {
  SimpleForm,
  TextInput,
  BooleanInput,
  Create,
  Edit,
  useRedirect
} from 'react-admin'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import PlatformList from './PlatformList'
import EditToolBar from '../../components/EditToolBar'
import * as constants from '../../constants'
import { Typography } from '@mui/material'

const schema = yup.object({
  name: yup.string().required(),
  active: yup.boolean()
})

const PlatformForm = ({ isEdit }: { isEdit?: boolean }): React.ReactElement => {
  const defaultValues = {
    name: '',
    active: true
  }
  const pageTitle = isEdit ? 'Edit Platform' : 'Add new Platform'
  return (
    <SimpleForm
      defaultValues={defaultValues}
      resolver={yupResolver(schema)}
      toolbar={<EditToolBar />}>
      <Typography variant='h6' fontWeight='bold'>
        {pageTitle}
      </Typography>
      <TextInput source='name' variant='outlined' sx={{ width: '100%' }} />
      <BooleanInput defaultValue={true} source='active' />
    </SimpleForm>
  )
}

const PlatformCreate = (): React.ReactElement => {
  const redirect = useRedirect()
  return (
    <Create
      mutationOptions={{
        onSuccess: (data: { platformNumber: string; id: number }): void => {
          redirect(`/${constants.R_PLATFORMS}/${data?.id}/show`)
        }
      }}
      resource={constants.R_PLATFORMS}>
      <PlatformForm />
    </Create>
  )
}

const PlatformEdit = (): React.ReactElement => {
  const redirect = useRedirect()

  return (
    <Edit
      resource={constants.R_PLATFORMS}
      mutationMode={constants.MUTATION_MODE}
      mutationOptions={{
        onSuccess: (data: { platformNumber: string; id: number }): void => {
          redirect(`/${constants.R_PLATFORMS}/${data?.id}/show`)
        }
      }}>
      <PlatformForm isEdit />
    </Edit>
  )
}

// const PlatformShow = (): React.ReactElement => {
//   return (
//     <Show>
//       <PlatformForm />
//     </Show>
//   )
// }

const platforms: ResourceRoutes = {
  create: PlatformCreate,
  edit: PlatformEdit,
  list: PlatformList
}

export default platforms
