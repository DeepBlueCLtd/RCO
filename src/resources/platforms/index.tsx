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

interface PropType {
  name: string
  isEdit: boolean
}

const PlatformForm = ({ isEdit }: PropType): React.ReactElement => {
  const defaultValues = {
    name: '',
    active: true
  }
  return (
    <SimpleForm
      defaultValues={defaultValues}
      resolver={yupResolver(schema)}
      toolbar={<EditToolBar />}>
      <Typography variant='h6' fontWeight='bold'>
        {isEdit ? 'Edit Platform' : 'Add new Platform'}
      </Typography>
      <TextInput source='name' variant='outlined' sx={{ width: '100%' }} />
      <BooleanInput defaultValue={true} source='active' />
    </SimpleForm>
  )
}

const PlatformCreate = ({ name }: PropType): React.ReactElement => {
  const cName: string = name
  return (
    <Create redirect={`/${cName}`} resource={constants.R_PLATFORMS}>
      <PlatformForm name={name} isEdit={false} />
    </Create>
  )
}

const PlatformEdit = ({ name }: PropType): React.ReactElement => {
  const cName: string = name
  const redirect = useRedirect()

  return (
    <Edit
      resource={constants.R_PLATFORMS}
      mutationMode={constants.MUTATION_MODE}
      mutationOptions={{
        onSuccess: (data: { platformNumber: string; id: number }): void => {
          redirect(`/${cName}/${data?.id}/show`)
        }
      }}>
      <PlatformForm name={name} isEdit />
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
