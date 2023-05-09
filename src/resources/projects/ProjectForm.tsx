import React from 'react'
import { SimpleForm, TextInput } from 'react-admin'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import EditToolBar from '../../components/EditToolBar'

const schema = yup.object({
  name: yup.string().required('Name is a required field'),
  remarks: yup.string()
})

export default function ProjectForm(): React.ReactElement {
  const defaultValues = {
    name: '',
    remarks: ''
  }

  return (
    <SimpleForm
      toolbar={<EditToolBar />}
      defaultValues={defaultValues}
      resolver={yupResolver(schema)}>
      <TextInput source='name' variant='outlined' sx={{ width: '100%' }} />
      <TextInput
        source='remarks'
        multiline
        variant='outlined'
        sx={{ width: '100%' }}
      />
    </SimpleForm>
  )
}
