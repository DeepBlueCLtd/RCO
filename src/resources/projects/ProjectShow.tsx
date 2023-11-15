import React from 'react'
import {
  Box,
  Card,
  CardContent,
  type SxProps,
  type Theme,
  Typography
} from '@mui/material'
import {
  BooleanField,
  CreateButton,
  DateField,
  EditButton,
  Show,
  TextField,
  TopToolbar,
  useShowContext
} from 'react-admin'
import { useNavigate, useParams } from 'react-router-dom'
import SourceField from '../../components/SourceField'
import * as constants from '../../constants'
import useCanAccess from '../../hooks/useCanAccess'
import { useConfigData } from '../../utils/useConfigData'
import FlexBox from '../../components/FlexBox'
import HistoryButton from '../../components/HistoryButton'

export const ValueField = ({
  label,
  children,
  sx = {}
}: {
  label: string
  children: any
  sx?: SxProps<Theme>
}): React.ReactElement => {
  return (
    <Typography fontWeight='bold' sx={sx}>
      {label}: {children}
    </Typography>
  )
}

const Actions = (): React.ReactElement => {
  const { id = '' } = useParams()
  const projectId: string = id
  const { hasAccess } = useCanAccess()
  const { record } = useShowContext()
  const navigate = useNavigate()

  return (
    <TopToolbar sx={{ alignItems: 'center' }}>
      {hasAccess(constants.R_PROJECTS, { write: true }) ? (
        <>
          <EditButton />
          <CreateButton
            label='Add new batch'
            to={`/${constants.R_BATCHES}/create?project=${projectId}`}
          />
        </>
      ) : null}
      <HistoryButton
        onClick={() => {
          navigate(
            `/audit?filter=${JSON.stringify({
              dataId: record.id,
              resource: constants.R_PROJECTS
            })}`
          )
        }}
      />
    </TopToolbar>
  )
}

export default function ProjectShow(): React.ReactElement {
  const configData = useConfigData()
  const pageTitle = `${configData?.projectName} Show`

  return (
    <Show actions={<Actions />}>
      <Typography variant='h5' fontWeight='bold' sx={{ padding: '15px' }}>
        <constants.ICON_PROJECT /> {pageTitle}
      </Typography>
      <Card>
        <CardContent sx={{ display: 'flex', flexDirection: 'column' }}>
          <Details />
          <Remarks />
          <Created />
        </CardContent>
      </Card>
    </Show>
  )
}

const Details = (): React.ReactElement => {
  const sx = { width: '100%' }
  return (
    <Box
      component='fieldset'
      style={{
        width: '100%',
        padding: '0 15px',
        borderRadius: 16,
        margin: '20px 0'
      }}>
      <legend>
        <Typography variant='h5' align='center' sx={{ fontWeight: '600' }}>
          Details
        </Typography>
      </legend>
      <FlexBox sx={{ padding: '10px 0' }}>
        <ValueField label='Name' sx={sx}>
          <TextField<Project> variant='h6' source='name' />
        </ValueField>
        <ValueField label='Start' sx={sx}>
          <DateField<Project> source='startDate' />
        </ValueField>
        <ValueField label='End' sx={sx}>
          <DateField<Project> source='endDate' />
        </ValueField>
        <ValueField label='Enduring' sx={sx}>
          <BooleanField source='enduring' looseValue />
        </ValueField>
      </FlexBox>
    </Box>
  )
}

const Remarks = (): React.ReactElement => {
  const sx = { width: '100%', padding: '10px 0' }

  return (
    <Box
      component='fieldset'
      style={{
        width: '100%',
        padding: '0 25px',
        borderRadius: 16,
        margin: '20px 0'
      }}>
      <legend>
        <Typography variant='h5' align='center' sx={{ fontWeight: '600' }}>
          Remarks
        </Typography>
      </legend>
      <FlexBox sx={sx}>
        <TextField<Project> source='remarks' />
      </FlexBox>
    </Box>
  )
}

const Created = (): React.ReactElement => {
  const sx = {
    width: '100%'
  }
  return (
    <Box
      component='fieldset'
      style={{
        width: '100%',
        padding: '0 15px',
        borderRadius: 16,
        margin: '20px 0'
      }}>
      <legend>
        <Typography variant='h5' align='center' sx={{ fontWeight: '600' }}>
          Created
        </Typography>
      </legend>
      <FlexBox sx={{ padding: '10px 0' }}>
        <ValueField label='Created at' sx={sx}>
          <DateField<Project> source='createdAt' />
        </ValueField>
        <ValueField label='Created by' sx={sx}>
          <SourceField<Project>
            source='createdBy'
            reference={constants.R_USERS}
          />
        </ValueField>
      </FlexBox>
    </Box>
  )
}
