import React from 'react'
import {
  DateField,
  Show,
  SimpleShowLayout,
  TextField,
  useRecordContext
} from 'react-admin'
import { Box, Typography } from '@mui/material'

const Finalised = (): React.ReactElement => {
  const { finalisedAt } = useRecordContext<Destruction>()

  const label = typeof finalisedAt !== 'undefined' ? 'Finlised' : 'Pending'

  return <Typography variant='body2'>{label}</Typography>
}

export default function DestructionShow(): React.ReactElement {
  return (
    <Box>
      <Show>
        <SimpleShowLayout>
          <TextField source='reference' />
          <DateField source='finalisedAt' />
          <Finalised />
          <TextField source='remarks' />
        </SimpleShowLayout>
      </Show>
    </Box>
  )
}
