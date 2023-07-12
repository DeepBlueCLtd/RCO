import React from 'react'
import { DateInput, SimpleForm, TextInput } from 'react-admin'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import EditToolBar from '../../components/EditToolBar'
import { Typography } from '@mui/material'
import { ICON_PROJECT } from '../../constants'
import { useConfigData } from '../../utils/useConfigData'
import FlexBox from '../../components/FlexBox'
import dayjs from 'dayjs'

const schema = yup.object({
  name: yup.string().required('Name is a required field'),
  remarks: yup.string(),
  startDate: yup.date().required(),
  endDate: yup
    .date()
    .required()
    .test(
      'endDate',
      'End date must be greater than start date',
      function (value) {
        return dayjs(value).diff(this.parent.startDate) > 0
      }
    )
})

export default function ProjectForm({ isEdit }: FormProps): React.ReactElement {
  const defaultValues = {
    name: '',
    remarks: ''
  }
  const configData = useConfigData()
  const pageTitle =
    isEdit !== undefined
      ? `Edit ${configData?.projectName}`
      : `Add new ${configData?.projectName}`

  return (
    <SimpleForm
      toolbar={<EditToolBar />}
      defaultValues={defaultValues}
      resolver={yupResolver(schema)}>
      <Typography variant='h5' fontWeight='bold'>
        <ICON_PROJECT /> {pageTitle}
      </Typography>
      <TextInput source='name' variant='outlined' sx={{ width: '100%' }} />
      <FlexBox>
        <DateInput
          sx={{ width: '100%' }}
          source='startDate'
          label='Start'
          variant='outlined'
        />
        <DateInput
          sx={{ width: '100%' }}
          source='endDate'
          variant='outlined'
          label='End'
        />
      </FlexBox>
      <TextInput
        source='remarks'
        multiline
        variant='outlined'
        sx={{ width: '100%' }}
      />
    </SimpleForm>
  )
}
