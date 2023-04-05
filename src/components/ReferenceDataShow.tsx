import React from 'react'
import { Card, CardContent, Typography } from '@mui/material'
import {
  EditButton,
  Show,
  TextField,
  TopToolbar,
  useShowContext
} from 'react-admin'

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

export default function ReferenceDataShow({
  name
}: {
  name: string
}): React.ReactElement {
  const cName: string = name
  const ListActions = () => {
    const { record } = useShowContext()
    const id: string = record.id
    return (
      <TopToolbar>
        <EditButton to={`/reference-data/${cName}/${id}`} />
      </TopToolbar>
    )
  }
  return (
    <Show actions={<ListActions />}>
      <Card>
        <CardContent sx={{ display: 'flex', flexDirection: 'column' }}>
          <ValueField label='Id'>
            <TextField variant='h6' source='name' />
          </ValueField>
        </CardContent>
      </Card>
    </Show>
  )
}
