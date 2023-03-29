import React from 'react'
import { Card, CardContent, Typography } from '@mui/material'
import { DateField, Show, TextField } from 'react-admin'

const ValueField = ({
  label,
  children
}: {
	label: string;
	children: any;
}): React.ReactElement => {
  return (
    <Typography fontWeight="bold">
      {label}: {children}
    </Typography>
  )
}

export default function ProjectShow(): React.ReactElement {
  return (
    <Show>
      <Card>
        <CardContent sx={{ display: 'flex', flexDirection: 'column' }}>
          <ValueField label="Id">
            <TextField variant="h6" source="id" />
          </ValueField>
          <ValueField label="Name">
            <TextField variant="h6" source="name" />
          </ValueField>
          <ValueField label="Start Date">
            <DateField source="start_date" />
          </ValueField>
          <ValueField label="End Date">
            <DateField source="end_date" />
          </ValueField>
          <ValueField label="Project code">
            <TextField source="project_code" />
          </ValueField>
          <ValueField label="Remarks">
            <TextField source="remarks" />
          </ValueField>
        </CardContent>
      </Card>
    </Show>
  )
}
