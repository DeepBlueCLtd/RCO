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

const schema = yup.object({
  name: yup.string().required(),
  active: yup.boolean()
})

interface PropType {
  name: string
}

const PlatformForm = (): React.ReactElement => {
  const defaultValues = {
    name: '',
    active: true
  }
  return (
    <SimpleForm
      defaultValues={defaultValues}
      resolver={yupResolver(schema)}
      toolbar={<EditToolBar />}>
      <TextInput source='name' variant='outlined' sx={{ width: '100%' }} />
      <BooleanInput defaultValue={true} source='active' />
    </SimpleForm>
  )
}

const PlatformCreate = ({ name }: PropType): React.ReactElement => {
  const cName: string = name
  return (
    <Create redirect={`/${cName}`} resource={constants.R_PLATFORMS}>
      <PlatformForm />
    </Create>
  )
}

const PlatformEdit = ({ name }: PropType): React.ReactElement => {
  const cName: string = name
  const redirect = useRedirect()

  return (
    <Edit
      resource={constants.R_PLATFORMS}
      mutationOptions={{
        onSuccess: (data: { platformNumber: string; id: number }): void => {
          redirect(`/${cName}/${data?.id}/show`)
        }
      }}>
      <PlatformForm />
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
