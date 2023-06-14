import React, { useState } from 'react'
import { Card, CardContent, IconButton, Typography } from '@mui/material'
import {
  CreateButton,
  EditButton,
  Show,
  TextField,
  TopToolbar,
  useShowContext
} from 'react-admin'
import { useParams } from 'react-router-dom'
import SourceField from '../../components/SourceField'
import * as constants from '../../constants'
import useCanAccess from '../../hooks/useCanAccess'
import { History } from '@mui/icons-material'
import { type HistoryProps, type ShowActionProps } from '../batches/BatchShow'
import ResourceHistoryModal from '../../components/ResourceHistory'

export const ValueField = ({
  label,
  children
}: {
  label: string
  children: any
}): React.ReactElement => {
  return (
    <Typography fontWeight='bold'>
      {label}: {children}
    </Typography>
  )
}

const HistoryModal = ({
  handleOpen,
  open
}: HistoryProps): React.ReactElement => {
  const { record } = useShowContext<Batch>()
  if (record === undefined) return <></>
  const filter = { dataId: record.id, resource: constants.R_PROJECTS }
  return (
    <ResourceHistoryModal
      open={open}
      close={() => {
        handleOpen(false)
      }}
      filter={filter}
    />
  )
}

const Actions = ({ handleOpen }: ShowActionProps): React.ReactElement => {
  const { id = '' } = useParams()
  const projectId: string = id
  const { hasAccess } = useCanAccess()

  return (
    <TopToolbar sx={{ alignItems: 'center' }}>
      {hasAccess(constants.R_PROJECTS, { write: true }) ? (
        <>
          <EditButton />
          <CreateButton
            label='Add new batch'
            to={`/batches/create?project=${projectId}`}
          />
        </>
      ) : null}
      <IconButton
        onClick={() => {
          handleOpen(true)
        }}>
        <History />
      </IconButton>
    </TopToolbar>
  )
}

export default function ProjectShow(): React.ReactElement {
  const pageTitle = 'View Project'
  const [open, setOpen] = useState(false)

  const handleOpen = (open: boolean): void => {
    setOpen(open)
  }
  return (
    <Show actions={<Actions handleOpen={handleOpen} />}>
      <Typography variant='h5' fontWeight='bold' sx={{ padding: '15px' }}>
        <constants.ICON_PROJECT /> {pageTitle}
      </Typography>
      <Card>
        <CardContent sx={{ display: 'flex', flexDirection: 'column' }}>
          <ValueField label='Id'>
            <TextField variant='h6' source='id' />
          </ValueField>
          <ValueField label='User name'>
            <SourceField source='createdBy' reference={constants.R_USERS} />
          </ValueField>
          <ValueField label='Name'>
            <TextField variant='h6' source='name' />
          </ValueField>
          <ValueField label='Remarks'>
            <TextField source='remarks' />
          </ValueField>
          <ValueField label='Created'>
            <TextField source='createdAt' />
          </ValueField>
        </CardContent>
      </Card>
      <HistoryModal handleOpen={handleOpen} open={open} />
    </Show>
  )
}
