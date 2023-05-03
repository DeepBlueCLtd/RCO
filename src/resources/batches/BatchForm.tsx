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
  AutocompleteInput
} from 'react-admin'
import * as yup from 'yup'
import DatePicker from '../../components/DatePicker'
import FlexBox from '../../components/FlexBox'
import EditToolBar from '../../components/EditToolBar'
import * as constants from '../../constants'
import { useLocation } from 'react-router-dom'
import { isNumber } from '../../utils/number'

const schema = yup.object({
  yearOfReceipt: yup.string().required(),
  department: yup.number().required(),
  project: yup.number().required(),
  platform: yup.number().required(),
  organisation: yup.number().required(),
  maximumProtectiveMarking: yup.number().required()
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

    if (isLoading !== undefined && isLoading) return null
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
          <AutocompleteInput optionText={optionsText} sx={sx} />
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
            <AutocompleteInput
              optionText={optionsText}
              sx={sx}
              defaultValue={projectId !== undefined ? projectId : null}
            />
          </ReferenceInput>
        </FlexBox>
        <FlexBox>
          {isEdit === undefined || !isEdit ? (
            <>
              <ConditionalReferenceInput
                source='organisation'
                reference='organisation'
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
          <ReferenceInput
            variant='outlined'
            source='maximumProtectiveMarking'
            reference='protectiveMarking'>
            <AutocompleteInput optionText={optionsText} sx={sx} />
          </ReferenceInput>
        </FlexBox>
        <TextInput multiline source='remarks' variant='outlined' sx={sx} />
        <TextInput multiline source='receiptNotes' variant='outlined' sx={sx} />
      </SimpleForm>
    </>
  )
}

export default BatchForm
