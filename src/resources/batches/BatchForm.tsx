import { yupResolver } from '@hookform/resolvers/yup'
import React, { useEffect, useState } from 'react'
import {
  SelectInput,
  type SelectInputProps,
  SimpleForm,
  TextInput,
  useGetList,
  type TextInputProps,
  ReferenceInput,
  AutocompleteInput,
  DateTimeInput
} from 'react-admin'
import * as yup from 'yup'
import DatePicker from '../../components/DatePicker'
import FlexBox from '../../components/FlexBox'
import EditToolBar from '../../components/EditToolBar'
import * as constants from '../../constants'
import { useLocation } from 'react-router-dom'
import { isNumber } from '../../utils/number'
import { Typography } from '@mui/material'
import dayjs from 'dayjs'

const schema = yup.object({
  yearOfReceipt: yup.string().required(),
  department: yup.number().required(),
  project: yup.number().required(),
  platform: yup.number().required(),
  organisation: yup.number().required(),
  maximumProtectiveMarking: yup.number().required(),
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

const BatchForm = (props: FormProps): React.ReactElement => {
  const [projectId, setProjectId] = useState<number>()
  const location = useLocation()
  const { isEdit } = props

  const defaultValues: Partial<Batch> = {
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

  const optionsText = (value: Batch): string => value.name

  const sx = { width: '100%' }

  interface Props {
    reference: string
    source: string
    inputProps?: SelectInputProps | TextInputProps
    active?: boolean
  }

  const ConditionalReferenceInput = <T extends ReferenceItem>(
    props: Props
  ): React.ReactElement | null => {
    const { source, reference, inputProps = {}, active } = props
    const filter = active !== undefined && active ? { active: true } : {}
    const { data, isLoading } = useGetList<T>(reference, {
      filter
    })
    const boolIsLoading: boolean = isLoading
    if (boolIsLoading) return null
    if (data === undefined) return null
    const choices = data.map((d) => ({ name: d.name, id: d.id }))

    return data?.length === 1 ? (
      <SelectInput
        source={source}
        disabled
        sx={sx}
        defaultValue={data[0].id}
        optionText={optionsText}
        choices={choices}
        {...inputProps}
      />
    ) : (
      <AutocompleteInput source={source} choices={choices} sx={sx} />
    )
  }
  const pageTitle = isEdit !== undefined ? 'Edit Batch' : 'Add new Batch'
  return (
    <>
      <SimpleForm
        toolbar={<EditToolBar />}
        defaultValues={defaultValues}
        resolver={yupResolver(schema)}>
        <Typography variant='h5' fontWeight='bold'>
          <constants.ICON_BATCH /> {pageTitle}
        </Typography>
        <FlexBox>
          <ReferenceInput
            variant='outlined'
            source='platform'
            filter={isEdit === true ? {} : { active: true }}
            reference={constants.R_PLATFORMS}>
            <AutocompleteInput optionText={optionsText} sx={sx} />
          </ReferenceInput>
          <ReferenceInput
            variant='outlined'
            source='project'
            reference={constants.R_PROJECTS}>
            <AutocompleteInput
              optionText={optionsText}
              sx={sx}
              defaultValue={projectId !== undefined ? projectId : null}
            />
          </ReferenceInput>
        </FlexBox>
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
            filter={isEdit === true ? {} : { active: true }}
            source='maximumProtectiveMarking'
            reference='protectiveMarking'>
            <AutocompleteInput optionText={optionsText} sx={sx} />
          </ReferenceInput>
        </FlexBox>
        <FlexBox>
          {isEdit === undefined || !isEdit ? (
            <>
              <ConditionalReferenceInput
                source='organisation'
                reference='organisation'
                active
              />
              <ConditionalReferenceInput
                source='department'
                reference='department'
                active
              />
            </>
          ) : (
            <>
              <ReferenceInput
                variant='outlined'
                source='organisation'
                reference='organisation'>
                <AutocompleteInput optionText={optionsText} sx={sx} />
              </ReferenceInput>
              <ReferenceInput
                variant='outlined'
                source='department'
                reference='department'>
                <AutocompleteInput optionText={optionsText} sx={sx} />
              </ReferenceInput>
            </>
          )}
        </FlexBox>
        <FlexBox>
          <DateTimeInput
            sx={sx}
            source='startDate'
            label='Start'
            variant='outlined'
          />
          <DateTimeInput
            sx={sx}
            source='endDate'
            variant='outlined'
            label='End'
          />
        </FlexBox>
        <TextInput multiline source='remarks' variant='outlined' sx={sx} />
        <TextInput multiline source='receiptNotes' variant='outlined' sx={sx} />
      </SimpleForm>
    </>
  )
}

export default BatchForm
