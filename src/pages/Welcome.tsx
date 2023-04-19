import React from 'react'
import { Box } from '@mui/material'
import * as constants from '../constants'

import Recent from '../components/Recent'
import FlexBox from '../components/FlexBox'
import { CreateButton } from 'react-admin'

export default function Welcome(): React.ReactElement {
  return (
    <Box display='flex' flexDirection='column' paddingTop='20px'>
      <CreateButton
        color='primary'
        variant='contained'
        resource={constants.R_BATCHES}
        label='Add New Batch'
        sx={{ width: '250px', height: '40px', margin: '0 auto' }}
      />
      <FlexBox marginTop='20px'>
        <Recent
          label='Recent Batches'
          resource={constants.R_BATCHES}
          fields={['name', 'batchNumber'] as Array<keyof Batch>}
        />
      </FlexBox>
    </Box>
  )
}
