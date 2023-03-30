import { yupResolver } from '@hookform/resolvers/yup'
import { Box } from '@mui/material'
import React from 'react'
import { ReferenceInput, SelectInput, SimpleForm, TextInput } from 'react-admin'
import * as yup from 'yup'
import DatePicker from './DatePicker'

const schema = yup.object({
  name: yup.string().required(),
  vault: yup.string().required(),
  year_of_receipt: yup.string().required(),
  department: yup.string().required(),
  project: yup.string().required(),
  platform: yup.string().required(),
  organisation: yup.string().required(),
  protective_marking_authority: yup.string().required(),
  maximum_protective_marking: yup.string().required(),
  remarks: yup.string().required()
})

const BatchForm = (): React.ReactElement => {
  const defaultValues = {
    name: '',
    batch_number: '',
    vault: '',
    year_of_receipt: '',
    department: '',
    project: '',
    platform: '',
    organisation: '',
    protective_marking_authority: '',
    maximum_protective_marking: '',
    remarks: ''
  }

  const optionsText = (value: Batch) => value.name

  const sx = { width: '100%' }

  return (
    <SimpleForm defaultValues={defaultValues} resolver={yupResolver(schema)}>
      <TextInput source='name' variant='outlined' sx={sx} />
      <FlexBox>
        <DatePicker
          label='Year of receipt'
          source='year_of_receipt'
          variant='outlined'
          format='YYYY'
          dataPickerProps={{ views: ['year'] }}
        />
        <ReferenceInput
          variant='outlined'
          source='project'
          reference='projects'>
          <SelectInput optionText={optionsText} sx={sx} />
        </ReferenceInput>
      </FlexBox>
      <FlexBox>
        <ReferenceInput
          variant='outlined'
          source='platform'
          reference='platforms'>
          <SelectInput optionText={optionsText} sx={sx} />
        </ReferenceInput>
        <ReferenceInput
          variant='outlined'
          source='department'
          reference='department'>
          <SelectInput optionText={optionsText} sx={sx} />
        </ReferenceInput>
      </FlexBox>
      <FlexBox>
        <ReferenceInput
          variant='outlined'
          source='protective_marking_authority'
          reference='protective-marking-authority'>
          <SelectInput optionText={optionsText} sx={sx} />
        </ReferenceInput>
        <ReferenceInput
          variant='outlined'
          source='maximum_protective_marking'
          reference='protective-marking'>
          <SelectInput optionText={optionsText} sx={sx} />
        </ReferenceInput>
      </FlexBox>
      <FlexBox>
        <ReferenceInput variant='outlined' source='vault' reference='vault'>
          <SelectInput optionText={optionsText} sx={sx} />
        </ReferenceInput>
        <ReferenceInput
          variant='outlined'
          source='organisation'
          reference='organisation'>
          <SelectInput optionText={optionsText} sx={sx} />
        </ReferenceInput>
      </FlexBox>
      <TextInput multiline source='remarks' variant='outlined' sx={sx} />
    </SimpleForm>
  )
}

export default BatchForm

interface FlexBoxProps {
  children: React.ReactElement | React.ReactElement[]
}

const FlexBox = (props: FlexBoxProps): React.ReactElement => {
  return (
    <Box display='flex' width='100%' alignItems='center' columnGap='20px'>
      {props.children}
    </Box>
  )
}
