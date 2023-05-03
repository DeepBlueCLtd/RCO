import { Box, Typography } from '@mui/material'
import { Show, SimpleShowLayout, TextField } from 'react-admin'
import { useParams } from 'react-router-dom'
import ItemsReport from '../items/ItemsReport'
import * as constants from '../../constants'

export default function VaultReport(): React.ReactElement {
  const { id = '' } = useParams()
  const vaultLocation: string = id

  return (
    <Box padding={'20px'}>
      <Typography variant='h4' textAlign='center' margin='10px'>
        Vault Report
      </Typography>
      <Show
        actions={false}
        resource={constants.R_VAULT_LOCATION}
        id={vaultLocation}>
        <Typography variant='h6' margin='16px'>
          Vault details:
        </Typography>
        <SimpleShowLayout>
          <TextField source='name' />
        </SimpleShowLayout>
      </Show>
      <ItemsReport
        storeKey='vault-report-items'
        hasCreate={false}
        filter={{ vaultLocation }}
      />
    </Box>
  )
}
