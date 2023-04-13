import React from 'react'
import { SimpleForm, TextInput, BooleanInput, Create, Edit } from 'react-admin'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import PlatformList from './PlatformList'

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
    <SimpleForm defaultValues={defaultValues} resolver={yupResolver(schema)}>
      <TextInput source='name' variant='outlined' sx={{ width: '100%' }} />
      <BooleanInput source='active' />
    </SimpleForm>
  )
}

const PlatformCreate = ({ name }: PropType): React.ReactElement => {
  const cName: string = name
  return (
    <Create redirect={`/reference-data/${cName}`}>
      <PlatformForm />
    </Create>
  )
}

const PlatformEdit = ({ name }: PropType): React.ReactElement => {
  const cName: string = name
  return (
    <Edit redirect={`/reference-data/${cName}`}>
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

const platforms = {
  create: PlatformCreate,
  edit: PlatformEdit,
  list: PlatformList
}

export default platforms
