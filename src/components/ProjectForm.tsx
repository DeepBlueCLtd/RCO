import React from 'react'
import { SimpleForm, TextInput, DateInput } from 'react-admin'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import dayjs from 'dayjs'
import { Box } from '@mui/material'

const schema = yup.object({
  name: yup.string().required('Name is a required field'),
  start_date: yup.date().required().typeError('Invalid Date'),
  end_date: yup
    .date()
    .typeError('Invalid Date')
    .required()
    .test(
      'end_date',
      'End date must be greater than start date',
      function (value) {
        return dayjs(value).diff(this.parent.start_date) > 0
      }
    ),
  project_code: yup.string().required('Project code is a required field'),
  remarks: yup.string()
})

export default function ProjectForm(): React.ReactElement {
  const defaultValues = {
    name: '',
    start_date: '',
    end_date: '',
    project_code: '',
    remarks: ''
  }
  return (
    <SimpleForm defaultValues={defaultValues} resolver={yupResolver(schema)}>
      <TextInput source="name" variant="outlined" sx={{ width: '100%' }} />
      <Box display="flex" width="100%" columnGap="20px">
        <DateInput source="start_date" variant="outlined" sx={{ flex: 1 }} />
        <DateInput source="end_date" variant="outlined" sx={{ flex: 1 }} />
      </Box>
      <TextInput
        source="project_code"
        variant="outlined"
        sx={{ width: '100%' }}
      />
      <TextInput
        source="remarks"
        multiline
        variant="outlined"
        sx={{ width: '100%' }}
      />
    </SimpleForm>
  )
}
