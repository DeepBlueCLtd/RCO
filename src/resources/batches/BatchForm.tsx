import { yupResolver } from '@hookform/resolvers/yup'
import React from 'react'
import { ReferenceInput, SelectInput, SimpleForm, TextInput } from 'react-admin'
import * as yup from 'yup'
import DatePicker from '../../components/DatePicker'
import FlexBox from '../../components/FlexBox'
import EditToolBar from '../../components/EditToolBar'
import * as constants from '../../constants'

const schema = yup.object({
  yearOfReceipt: yup.string().required(),
  department: yup.number().required(),
  project: yup.number().required(),
  platform: yup.number().required(),
  organisation: yup.number().required(),
  protectiveMarkingAuthority: yup.number().required(),
  maximumProtectiveMarking: yup.number().required(),
  remarks: yup.string().required()
})

const BatchForm = (props: FormProps): React.ReactElement => {
  const defaultValues: Partial<Batch> = {
    batchNumber: '',
    yearOfReceipt: '',
    remarks: ''
  }

  const optionsText = (value: Batch) => value.name

  const sx = { width: '100%' }

  return (
    <SimpleForm
      toolbar={<EditToolBar isEdit={props.isEdit} />}
      defaultValues={defaultValues}
      resolver={yupResolver(schema)}>
      <ReferenceInput
        variant='outlined'
        source='platform'
        reference={constants.R_PLATFORMS}>
        <SelectInput optionText={optionsText} sx={sx} />
      </ReferenceInput>
      <FlexBox>
        <DatePicker
          label='Year of receipt'
          source='yearOfReceipt'
          variant='outlined'
          format='YYYY'
          dataPickerProps={{ views: ['year'] }}
        />
        <ReferenceInput
          variant='outlined'
          source='project'
          reference={constants.R_PROJECTS}>
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
          source='protectiveMarkingAuthority'
          reference='protectiveMarkingAuthority'>
          <SelectInput optionText={optionsText} sx={sx} />
        </ReferenceInput>
        <ReferenceInput
          variant='outlined'
          source='maximumProtectiveMarking'
          reference='protectiveMarking'>
          <SelectInput optionText={optionsText} sx={sx} />
        </ReferenceInput>
      </FlexBox>
      <TextInput multiline source='remarks' variant='outlined' sx={sx} />
    </SimpleForm>
  )
}

export default BatchForm
