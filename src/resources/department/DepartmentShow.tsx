import React from 'react'
import { Card, CardContent, Typography } from '@mui/material'
import { Show, TextField } from 'react-admin'

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

export default function DepartmentShow(): React.ReactElement {
  return (
    <Show>
      <Card>
        <CardContent sx={{ display: 'flex', flexDirection: 'column' }}>
          <ValueField label='name'>
            <TextField source='name' />
          </ValueField>
        </CardContent>
      </Card>
    </Show>
  )
}
