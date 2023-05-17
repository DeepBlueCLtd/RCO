import React from 'react'
import { Card, CardContent, Typography } from '@mui/material'
import {
  CreateButton,
  EditButton,
  Show,
  TextField,
  TopToolbar
} from 'react-admin'
import { useParams } from 'react-router-dom'
import SourceField from '../../components/SourceField'
import * as constants from '../../constants'
import useCanAccess from '../../hooks/useCanAccess'

const ValueField = ({
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

const Actions = (): React.ReactElement => {
  const { id = '' } = useParams()
  const projectId: string = id
  const { hasAccess } = useCanAccess()

  return (
    <TopToolbar>
      {hasAccess(constants.R_PROJECTS, { write: true }) ? (
        <>
          <EditButton />
          <CreateButton
            label='Add new batch'
            to={`/batches/create?project=${projectId}`}
          />
        </>
      ) : null}
    </TopToolbar>
  )
}

export default function ProjectShow(): React.ReactElement {
  const pageTitle = 'View Project'
  return (
    <Show actions={<Actions />}>
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
    </Show>
  )
}
