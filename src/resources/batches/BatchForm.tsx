import { yupResolver } from '@hookform/resolvers/yup'
import React from 'react'
import { ReferenceInput, SelectInput, SimpleForm, TextInput } from 'react-admin'
import * as yup from 'yup'
import DatePicker from '../../components/DatePicker'
import FlexBox from '../../components/FlexBox'

const schema = yup.object({
  year_of_receipt: yup.string().required(),
  department: yup.number().required(),
  project: yup.number().required(),
  platform: yup.number().required(),
  organisation: yup.number().required(),
  protective_marking_authority: yup.number().required(),
  maximum_protective_marking: yup.number().required(),
  remarks: yup.string().required()
})

const BatchForm = (): React.ReactElement => {
  const defaultValues: Partial<Batch> = {
    batch_number: '',
    year_of_receipt: '',
    remarks: ''
  }

  const optionsText = (value: Batch) => value.name

  const sx = { width: '100%' }

  return (
    <SimpleForm defaultValues={defaultValues} resolver={yupResolver(schema)}>
      <ReferenceInput
        variant='outlined'
        source='platform'
        reference='platforms'>
        <SelectInput optionText={optionsText} sx={sx} />
      </ReferenceInput>
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
          source='organisation'
          reference='organisation'>
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
      <TextInput multiline source='remarks' variant='outlined' sx={sx} />
    </SimpleForm>
  )
}

export default BatchForm
