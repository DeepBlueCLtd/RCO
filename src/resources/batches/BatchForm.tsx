import { yupResolver } from '@hookform/resolvers/yup'
import React, { useEffect, useMemo, useState } from 'react'
import {
  SimpleForm,
  TextInput,
  useGetList,
  ReferenceInput,
  AutocompleteInput,
  DateInput,
  type SortPayload,
  type AutocompleteInputProps
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
import { DateTime } from 'luxon'

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
  inputProps?: AutocompleteInputProps
  active?: boolean
  show?: boolean
  isEdit?: boolean
  choices?: any[]
  label?: string
  defaultValue?: number | null
  sort?: SortPayload
  groupBy?: (option: any) => string
}

export const ConditionalReferenceInput = <T extends IntegerReferenceItem>(
  props: Props
): React.ReactElement | null => {
  const {
    source,
    reference,
    show = false,
    isEdit,
    label,
    defaultValue,
    sort,
    groupBy,
    inputProps
  } = props
  const { data, isLoading } = useGetList<T>(
    reference,
    !isEdit ? { filter: { active: true } } : undefined
  )
  if (isLoading) return null
  if (data === undefined) return null

  return (
    <ReferenceInput
      reference={reference}
      source={source}
      {...(!isEdit ? { filter: { active: true } } : null)}
      sort={sort}>
      <AutocompleteInput
        label={label}
        sx={sx}
        defaultValue={defaultValue ?? (data.length === 1 ? data[0].id : null)}
        optionText={(choice) =>
          choice.active ? choice.name : `${choice.name} (Legacy)`
        }
        inputText={(choice) => choice.name}
        disabled={data?.length === 1 || show}
        groupBy={groupBy}
        {...inputProps}
      />
    </ReferenceInput>
  )
}

const BatchForm = (
  props: FormProps & { isShow?: boolean }
): React.ReactElement | null => {
  const [projectId, setProjectId] = useState<number>()
  const location = useLocation()
  const { isEdit, isShow } = props
  const configData = useConfigData()

  // check that date is in the last two years
  const compareDate = useMemo(
    () => DateTime.now().minus({ years: 2 }).toISO(),
    []
  )
  const { data: enduringProjects } = useGetList<Project>(constants.R_PROJECTS, {
    pagination: { page: 1, perPage: 10 },
    filter: {
      enduring: true
    }
  })

  const { data: nonEnduringProjects } = useGetList<Project>(
    constants.R_PROJECTS,
    {
      pagination: { page: 1, perPage: 40 },
      filter: {
        enduring: false,
        active: true,
        endDate_gte: compareDate // only offer recent projects
      },
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
          <ConditionalReferenceInput
            source='platform'
            reference={constants.R_PLATFORMS}
            isEdit={isEdit}
            show={isShow}
          />

          <ConditionalReferenceInput
            source='project'
            reference={constants.R_PROJECTS}
            isEdit={isEdit}
            show={isShow}
            label={configData?.projectName}
            defaultValue={projectId !== undefined ? projectId : null}
            sort={{ field: 'enduring', order: 'DESC' }}
            groupBy={(option) => (option.enduring ? 'Enduring' : 'Regular')}
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
              isEdit={isEdit}
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
          <ConditionalReferenceInput
            source='organisation'
            reference={constants.R_ORGANISATION}
            isEdit={isEdit}
            show={isShow}
          />
          <ConditionalReferenceInput
            source='department'
            reference={constants.R_DEPARTMENT}
            isEdit={isEdit}
            show={isShow}
          />
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
