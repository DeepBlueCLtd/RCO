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
  DateInput
} from 'react-admin'
import * as yup from 'yup'
import DatePicker from '../../components/DatePicker'
import FlexBox from '../../components/FlexBox'
import EditToolBar from '../../components/EditToolBar'
import * as constants from '../../constants'
import { useLocation } from 'react-router-dom'
import { isNumber } from '../../utils/number'
import { Typography } from '@mui/material'
import { useConfigData } from '../../utils/useConfigData'
import SourceInput from '../../components/SourceInput'

const schema = yup.object({
  yearOfReceipt: yup.number().required(),
  department: yup.string().nullable(),
  project: yup.number().nullable(),
  platform: yup.number().nullable(),
  organisation: yup.string().nullable(),
  vault: yup.string()
})

const sx = { width: '100%' }

interface Props {
  reference: string
  source: string
  inputProps?: SelectInputProps | TextInputProps
  active?: boolean
}

export const ConditionalReferenceInput = <T extends IntegerReferenceItem>(
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

const BatchForm = (
  props: FormProps & { isShow?: boolean }
): React.ReactElement | null => {
  const [projectId, setProjectId] = useState<number>()
  const location = useLocation()
  const { isEdit, isShow } = props
  const configData = useConfigData()
  const { data: enduringProjects } = useGetList<Project>(constants.R_PROJECTS, {
    pagination: { page: 1, perPage: 10 },
    filter: { enduring: true }
  })

  const { data: nonEnduringProjects } = useGetList<Project>(
    constants.R_PROJECTS,
    {
      pagination: { page: 1, perPage: 40 },
      filter: { enduring: false },
      sort: { field: 'id', order: 'DESC' }
    }
  )

  const defaultValues: Partial<Batch> = {
    batchNumber: '',
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

  if (enduringProjects === undefined || nonEnduringProjects === undefined)
    return null

  const choices = [...enduringProjects, ...nonEnduringProjects].map((d) => ({
    name: d.name,
    id: d.id,
    enduring: d.enduring
  }))

  const ToolBar = (): React.ReactElement => {
    return <EditToolBar type='button' />
  }

  const Created = (): React.ReactElement => {
    const sx = {
      width: '100%'
    }
    return (
      <FlexBox>
        <DateInput source='createdAt' sx={sx} disabled />
        <SourceInput
          source='createdBy'
          reference={constants.R_USERS}
          inputProps={{ sx, disabled: true }}
        />
      </FlexBox>
    )
  }

  return (
    <>
      <SimpleForm
        toolbar={!isShow && <ToolBar />}
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
            <AutocompleteInput optionText='name' sx={sx} disabled={isShow} />
          </ReferenceInput>
          <AutocompleteInput
            source='project'
            label={configData?.projectName}
            optionText='name'
            choices={choices}
            sx={sx}
            groupBy={(option) => (option.enduring ? 'Enduring' : 'Regular')}
            defaultValue={projectId !== undefined ? projectId : null}
            disabled={isShow}
          />
        </FlexBox>
        <FlexBox marginBottom='20px' alignItems='center'>
          <DatePicker
            label='Year of receipt'
            source='yearOfReceipt'
            variant='outlined'
            format='YYYY'
            dataPickerProps={{ views: ['year'], disabled: isShow }}
            sx={sx}
          />
          {(isEdit === undefined || !isEdit) &&
          (!isShow || isShow === undefined) ? (
            <ConditionalReferenceInput
              source='vault'
              reference={constants.R_VAULT}
              inputProps={{ helperText: false }}
              active
            />
          ) : (
            <ReferenceInput
              variant='outlined'
              source='vault'
              reference={constants.R_VAULT}>
              <AutocompleteInput
                label='Vault'
                helperText={false}
                optionText='name'
                sx={sx}
                defaultValue={1}
                disabled={isShow}
              />
            </ReferenceInput>
          )}
        </FlexBox>
        <FlexBox>
          {(isEdit === undefined || !isEdit) &&
          (!isShow || isShow === undefined) ? (
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
                <AutocompleteInput
                  optionText='name'
                  sx={sx}
                  disabled={isShow}
                />
              </ReferenceInput>
              <ReferenceInput
                variant='outlined'
                source='department'
                reference={constants.R_DEPARTMENT}>
                <AutocompleteInput
                  optionText='name'
                  sx={sx}
                  disabled={isShow}
                />
              </ReferenceInput>
            </>
          )}
        </FlexBox>
        <Created />
        <TextInput
          multiline
          source='remarks'
          variant='outlined'
          sx={sx}
          disabled={isShow}
        />
        <TextInput
          multiline
          source='receiptNotes'
          variant='outlined'
          sx={sx}
          disabled={isShow}
        />
      </SimpleForm>
    </>
  )
}

export default BatchForm
