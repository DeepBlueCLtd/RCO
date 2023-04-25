import React from 'react'
import { Card, CardContent, Typography } from '@mui/material'
import {
  CreateButton,
  DateField,
  EditButton,
  Show,
  TextField,
  TopToolbar
} from 'react-admin'
import { useParams } from 'react-router-dom'
import SourceField from '../../components/SourceField'
import * as constants from '../../constants'

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

const Actions = () => {
  const { id = '' } = useParams()
  const projectId: string = id

  return (
    <TopToolbar>
      <EditButton />
      <CreateButton
        label='Add new batch'
        to={`/batches/create?project=${projectId}`}
      />
    </TopToolbar>
  )
}

export default function ProjectShow(): React.ReactElement {
  return (
    <Show actions={<Actions />}>
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
          <ValueField label='Start Date'>
            <DateField source='startDate' />
          </ValueField>
          <ValueField label='End Date'>
            <DateField source='endDate' />
          </ValueField>
          <ValueField label='Project code'>
            <TextField source='projectCode' />
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
