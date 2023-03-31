import React from 'react'
import { Card, CardContent, Typography } from '@mui/material'
import {
  DeleteButton,
  EditButton,
  Show,
  TextField,
  TopToolbar
} from 'react-admin'
import SourceField from '../../components/SourceField'

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

const ShowActions = () => (
  <TopToolbar>
    <EditButton />
    <DeleteButton />
  </TopToolbar>
)

export default function BatchShow(): React.ReactElement {
  return (
    <Show actions={<ShowActions />}>
      <Card>
        <CardContent sx={{ display: 'flex', flexDirection: 'column' }}>
          <ValueField label='Id'>
            <TextField source='id' />
          </ValueField>
          <ValueField label='Reference'>
            <TextField source='batch_number' />
          </ValueField>
          <ValueField label='Year of receipt'>
            <TextField source='year_of_receipt' />
          </ValueField>
          <ValueField label='Project'>
            <SourceField source='project' reference='projects' />
          </ValueField>
          <ValueField label='Platform'>
            <SourceField source='platform' reference='platforms' />
          </ValueField>
          <ValueField label='Organisation'>
            <SourceField source='organisation' reference='organisation' />
          </ValueField>
          <ValueField label='Department'>
            <SourceField source='department' reference='department' />
          </ValueField>
          <ValueField label='Protective marking authority'>
            <SourceField
              source='protective_marking_authority'
              reference='protective-marking-authority'
            />
          </ValueField>
          <ValueField label='Maximum protective marking'>
            <SourceField
              source='maximum_protective_marking'
              reference='protective-marking'
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
