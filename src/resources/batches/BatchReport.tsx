import { Box, Typography } from '@mui/material'
import React from 'react'
import {
  Datagrid,
  List,
  TextField,
  Show,
  SimpleShowLayout,
  DateField
} from 'react-admin'
import SourceField from '../../components/SourceField'
import * as constants from '../../constants'

interface Props {
  batchId: string
}

export default function BatchReport(props: Props): React.ReactElement {
  const { batchId } = props

  return (
    <Box padding={'20px'}>
      <Typography variant='h4' textAlign='center' margin='10px'>
        Batch Report
      </Typography>

      <Show actions={false} resource={constants.R_BATCHES} id={batchId}>
        <Typography variant='h6' margin='16px'>
          Batch details:
        </Typography>
        <SimpleShowLayout>
          <TextField source='batchNumber' />
          <DateField source='createdAt' />
          <SourceField source='project' reference={constants.R_PROJECTS} />
          <SourceField source='platform' reference={constants.R_PLATFORMS} />
        </SimpleShowLayout>
      </Show>

      <List
        resource={constants.R_ITEMS}
        pagination={false}
        filter={{ batchId }}
        actions={false}
        sx={{ margin: '20px 0' }}>
        <Typography variant='h6' margin='16px'>
          Items:
        </Typography>

        <Datagrid bulkActionButtons={false}>
          <TextField source='item_number' label='Item Number' />
          <TextField source='mediaType' label='Media type' />
          <SourceField source='vaultLocation' reference='vaultLocation' />
        </Datagrid>
      </List>
    </Box>
  )
}
