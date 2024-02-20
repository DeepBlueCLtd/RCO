import React from 'react'
import { BooleanInput, SimpleForm, TextInput } from 'react-admin'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import EditToolBar from '../../components/EditToolBar'
import { Typography } from '@mui/material'

const schema = yup.object({
  name: yup.string().required(),
  active: yup.boolean()
})
interface PropsType {
  isEdit: boolean
}
export default function VaultLocationForm({
  isEdit
}: PropsType): React.ReactElement {
  const defaultValues = {
    name: ''
  }

  return (
    <SimpleForm
      toolbar={<EditToolBar />}
      defaultValues={defaultValues}
      resolver={yupResolver(schema)}>
      <Typography variant='h6' fontWeight='bold'>
        {isEdit ? 'Edit Vault Location' : 'Add new Vault Location'}
      </Typography>
      <TextInput source='name' variant='outlined' sx={{ width: '100%' }} />
      <BooleanInput defaultValue={true} source='active' />
    </SimpleForm>
  )
}
