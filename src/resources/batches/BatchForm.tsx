import { yupResolver } from '@hookform/resolvers/yup'
import React, { useEffect, useState } from 'react'
import {
  DateInput,
  ReferenceInput,
  SelectInput,
  SimpleForm,
  TextInput
} from 'react-admin'
import * as yup from 'yup'
import DatePicker from '../../components/DatePicker'
import FlexBox from '../../components/FlexBox'
import EditToolBar from '../../components/EditToolBar'
import * as constants from '../../constants'
import { useLocation } from 'react-router-dom'
import { isNumber } from '../../utils/number'
import dayjs from 'dayjs'

const schema = yup.object({
  yearOfReceipt: yup.string().required(),
  department: yup.number().required(),
  project: yup.number().required(),
  platform: yup.number().required(),
  organisation: yup.number().required(),
  maximumProtectiveMarking: yup.number().required(),
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
  projectCode: yup.string().required('Project code is a required field')
})

const BatchForm = (props: FormProps): React.ReactElement => {
  const [projectId, setProjectId] = useState<number>()
  const location = useLocation()
  const { isEdit } = props

  const defaultValues: Partial<Batch> = {
    startDate: '',
    endDate: '',
    projectCode: '',
    batchNumber: '',
    yearOfReceipt: '',
    remarks: ''
  }

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search)
    const projectId = searchParams.get('project')
    if (projectId !== null && isNumber(projectId)) {
      setProjectId(Number(projectId))
    }
  }, [])

  const optionsText = (value: Batch) => value.name

  const sx = { width: '100%' }

  return (
    <>
      <SimpleForm
        toolbar={<EditToolBar isEdit={isEdit} />}
        defaultValues={defaultValues}
        resolver={yupResolver(schema)}>
        <ReferenceInput
          variant='outlined'
          source='platform'
          filter={isEdit === true ? {} : { active: true }}
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
            <SelectInput
              optionText={optionsText}
              sx={sx}
              defaultValue={projectId !== undefined ? projectId : null}
            />
          </ReferenceInput>
        </FlexBox>
        <FlexBox>
          <ReferenceInput
            variant='outlined'
            source='organisation'
            reference='organisation'
            filter={{ active: true }}>
            <SelectInput optionText={optionsText} sx={sx} />
          </ReferenceInput>
          <ReferenceInput
            variant='outlined'
            source='department'
            filter={{ active: true }}
            {...(isEdit === undefined ? {} : { filter: { active: true } })}
            reference='department'>
            <SelectInput optionText={optionsText} sx={sx} />
          </ReferenceInput>
        </FlexBox>
        <FlexBox display='flex' width='100%' columnGap='20px'>
          <DateInput source='startDate' variant='outlined' sx={{ flex: 1 }} />
          <DateInput source='endDate' variant='outlined' sx={{ flex: 1 }} />
        </FlexBox>
        <FlexBox>
          <ReferenceInput
            variant='outlined'
            source='maximumProtectiveMarking'
            reference='protectiveMarking'>
            <SelectInput optionText={optionsText} sx={sx} />
          </ReferenceInput>
        </FlexBox>
        <TextInput
          source='projectCode'
          variant='outlined'
          sx={{ width: '100%' }}
        />
        <TextInput multiline source='remarks' variant='outlined' sx={sx} />
        <TextInput multiline source='receiptNotes' variant='outlined' sx={sx} />
      </SimpleForm>
    </>
  )
}

export default BatchForm
