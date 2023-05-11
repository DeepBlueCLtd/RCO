import React from 'react'
import { SimpleForm, TextInput } from 'react-admin'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import EditToolBar from '../../components/EditToolBar'
import { Typography } from '@mui/material'
import { ICON_PROJECT } from '../../constants'

const schema = yup.object({
  name: yup.string().required('Name is a required field'),
  remarks: yup.string()
})

export default function ProjectForm({ isEdit }: FormProps): React.ReactElement {
  const defaultValues = {
    name: '',
    remarks: ''
  }

  const pageTitle = isEdit !== undefined ? 'Edit Project' : 'Add new Project'

  return (
    <SimpleForm
      toolbar={<EditToolBar />}
      defaultValues={defaultValues}
      resolver={yupResolver(schema)}>
      <Typography variant='h5' fontWeight='bold'>
        <ICON_PROJECT /> {pageTitle}
      </Typography>
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
