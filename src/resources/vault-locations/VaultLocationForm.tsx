import React from 'react'
import { BooleanInput, SimpleForm, TextInput } from 'react-admin'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import EditToolBar from '../../components/EditToolBar'

const schema = yup.object({
  name: yup.string().required(),
  active: yup.boolean()
})

export default function VaultLocationForm(): React.ReactElement {
  const defaultValues = {
    name: ''
  }

  return (
    <SimpleForm
      toolbar={<EditToolBar />}
      defaultValues={defaultValues}
      resolver={yupResolver(schema)}>
      <TextInput source='name' variant='outlined' sx={{ width: '100%' }} />
      <BooleanInput defaultValue={true} source='active' />
    </SimpleForm>
  )
}
