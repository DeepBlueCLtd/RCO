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
  DateInput,
  useRedirect
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
import ProtectionBlockInputs from '../../components/ProtectionBlockInputs'
import { useConfigData } from '../../utils/useConfigData'

const schema = yup.object({
  yearOfReceipt: yup.string().required(),
  department: yup.number().required(),
  project: yup.number().nullable(),
  platform: yup.number().nullable(),
  organisation: yup.number().required(),
  protectiveMarking: yup.number().required(),
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

const sx = { width: '100%' }

interface Props {
  reference: string
  source: string
  inputProps?: SelectInputProps | TextInputProps
  active?: boolean
}

export const ConditionalReferenceInput = <T extends ActiveReferenceItem>(
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
      optionText='name'
      choices={choices}
      {...inputProps}
    />
  ) : (
    <AutocompleteInput source={source} choices={choices} sx={sx} />
  )
}

const BatchForm = (props: FormProps): React.ReactElement => {
  const [projectId, setProjectId] = useState<number>()
  const location = useLocation()
  const { isEdit } = props
  const configData = useConfigData()
  const [itemId, setItemId] = useState<Item['id']>()

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

  const pageTitle = isEdit !== undefined ? 'Edit Batch' : 'Add new Batch'

  const ToolBar = (): React.ReactElement => {
    const redirect = useRedirect()
    const transformResource = (
      data: Record<string, any>
    ): Record<string, any> => {
      const { catCave, catCode, catHandling, ...rest } = data
      return rest
    }

    return (
      <EditToolBar
        type='button'
        mutationOptions={{
          onSuccess: ({ id }: { id: number }) => {
            setItemId(id)
            if (!isEdit) {
              const path = `/${constants.R_BATCHES}/${id}/show`
              redirect(path)
            }
          }
        }}
        transform={transformResource}
      />
    )
  }

  return (
    <>
      <SimpleForm
        toolbar={<ToolBar />}
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
            <AutocompleteInput optionText='name' sx={sx} />
          </ReferenceInput>
          <ReferenceInput
            variant='outlined'
            source='project'
            reference={constants.R_PROJECTS}>
            <AutocompleteInput
              label={configData?.projectName}
              optionText='name'
              sx={sx}
              defaultValue={projectId !== undefined ? projectId : null}
            />
          </ReferenceInput>
        </FlexBox>
        <FlexBox marginBottom='20px'>
          <DatePicker
            label='Year of receipt'
            source='yearOfReceipt'
            variant='outlined'
            format='YYYY'
            dataPickerProps={{ views: ['year'] }}
          />
        </FlexBox>
        <FlexBox>
          {isEdit === undefined || !isEdit ? (
            <>
              <ConditionalReferenceInput
                source='organisation'
                reference={constants.R_ORGANISATION}
                active
              />
              <ConditionalReferenceInput
                source='department'
                reference={constants.R_DEPARTMENT}
                active
              />
            </>
          ) : (
            <>
              <ReferenceInput
                variant='outlined'
                source='organisation'
                reference={constants.R_ORGANISATION}>
                <AutocompleteInput optionText='name' sx={sx} />
              </ReferenceInput>
              <ReferenceInput
                variant='outlined'
                source='department'
                reference={constants.R_DEPARTMENT}>
                <AutocompleteInput optionText='name' sx={sx} />
              </ReferenceInput>
            </>
          )}
        </FlexBox>
        <ProtectionBlockInputs<BatchCode, BatchCave, BatchHandling>
          isEdit={isEdit}
          markingSource='protectiveMarking'
          id={itemId}
          refTables={{
            catCave: constants.R_BATCH_CAVE,
            catCode: constants.R_BATCH_CODE,
            catHandle: constants.R_BATCH_HANDLE
          }}
          resource={constants.R_BATCHES}
        />
        <FlexBox>
          <DateInput
            sx={sx}
            source='startDate'
            label='Start'
            variant='outlined'
          />
          <DateInput sx={sx} source='endDate' variant='outlined' label='End' />
        </FlexBox>
        <TextInput multiline source='remarks' variant='outlined' sx={sx} />
        <TextInput multiline source='receiptNotes' variant='outlined' sx={sx} />
      </SimpleForm>
    </>
  )
}

export default BatchForm
