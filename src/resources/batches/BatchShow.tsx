import React from 'react'
import { Card, CardContent, Typography } from '@mui/material'
import {
  CreateButton,
  DeleteWithConfirmButton,
  EditButton,
  Show,
  TextField,
  TopToolbar
} from 'react-admin'
import SourceField from '../../components/SourceField'
import { useParams } from 'react-router-dom'

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

const ShowActions = () => {
  const { id = '' } = useParams()
  const batchId: string = id
  return (
    <TopToolbar>
      <CreateButton label='Create item' to={`/items/create?batch=${batchId}`} />
      <EditButton />
      <DeleteWithConfirmButton />
    </TopToolbar>
  )
}

export default function BatchShow(): React.ReactElement {
  return (
    <Show actions={<ShowActions />}>
      <Card>
        <CardContent sx={{ display: 'flex', flexDirection: 'column' }}>
          <ValueField label='Id'>
            <TextField source='id' />
          </ValueField>
          <ValueField label='Reference'>
            <TextField source='batchNumber' />
          </ValueField>
          <ValueField label='Year of receipt'>
            <TextField source='yearOfReceipt' />
          </ValueField>
          <ValueField label='Project'>
            <SourceField source='project' reference={constants.R_PROJECTS} />
          </ValueField>
          <ValueField label='Platform'>
            <SourceField source='platform' reference={constants.R_PLATFORMS} />
          </ValueField>
          <ValueField label='Organisation'>
            <SourceField source='organisation' reference='organisation' />
          </ValueField>
          <ValueField label='Department'>
            <SourceField source='department' reference='department' />
          </ValueField>
          <ValueField label='Protective marking authority'>
            <SourceField
              source='protectiveMarkingAuthority'
              reference='protectiveMarkingAuthority'
            />
          </ValueField>
          <ValueField label='Maximum protective marking'>
            <SourceField
              source='maximumProtectiveMarking'
              reference='protectiveMarking'
            />
          </ValueField>
          <ValueField label='Remarks'>
            <TextField source='remarks' />
          </ValueField>
        </CardContent>
      </Card>
    </Show>
  )
}
