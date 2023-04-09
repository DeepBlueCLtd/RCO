import React from 'react'
import { SimpleForm, TextInput, DateInput } from 'react-admin'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import dayjs from 'dayjs'
import { Box } from '@mui/material'
import EditToolBar from '../../components/EditToolBar'

const schema = yup.object({
  name: yup.string().required('Name is a required field'),
  startDate: yup.date().required().typeError('Invalid Date'),
  endDate: yup
    .date()
    .typeError('Invalid Date')
    .required()
    .test(
      'endDate',
      'End date must be greater than start date',
      function (value) {
        return dayjs(value).diff(this.parent.startDate) > 0
      }
    ),
  projectCode: yup.string().required('Project code is a required field'),
  remarks: yup.string()
})

export default function ProjectForm(props: FormProps): React.ReactElement {
  const defaultValues = {
    name: '',
    startDate: '',
    endDate: '',
    projectCode: '',
    remarks: ''
  }
  return (
    <SimpleForm
      toolbar={<EditToolBar isEdit={props.isEdit} />}
      defaultValues={defaultValues}
      resolver={yupResolver(schema)}>
      <TextInput source='name' variant='outlined' sx={{ width: '100%' }} />
      <Box display='flex' width='100%' columnGap='20px'>
        <DateInput source='startDate' variant='outlined' sx={{ flex: 1 }} />
        <DateInput source='endDate' variant='outlined' sx={{ flex: 1 }} />
      </Box>
      <TextInput
        source='projectCode'
        variant='outlined'
        sx={{ width: '100%' }}
      />
      <TextInput
        source='remarks'
        multiline
        variant='outlined'
        sx={{ width: '100%' }}
      />
    </SimpleForm>
  )
}
