import { Box, Typography } from '@mui/material'
import React from 'react'
import { TextField, Show, SimpleShowLayout, DateField } from 'react-admin'
import SourceField from '../../components/SourceField'
import * as constants from '../../constants'
import ItemsReport from '../items/ItemsReport'
import { useConfigData } from '../../utils/useConfigData'

interface Props {
  batch: Batch['id']
}

export default function BatchReport(props: Props): React.ReactElement {
  const { batch } = props
  const configData = useConfigData()

  return (
    <Box padding={'20px'}>
      <Typography variant='h4' textAlign='center' margin='10px'>
        Batch Report
      </Typography>

      <Show actions={false} resource={constants.R_BATCHES} id={batch}>
        <Typography variant='h6' margin='16px'>
          Batch details:
        </Typography>
        <SimpleShowLayout>
          <TextField source='batchNumber' />
          <DateField source='createdAt' />
          <SourceField
            source='project'
            reference={constants.R_PROJECTS}
            label={configData?.projectName}
          />
          <SourceField source='platform' reference={constants.R_PLATFORMS} />
        </SimpleShowLayout>
      </Show>

      <ItemsReport storeKey='batch-report-items' filter={{ batch }} />
    </Box>
  )
}
