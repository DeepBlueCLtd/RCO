import React from 'react'
import { Box } from '@mui/material'
import * as constants from '../constants'

import Recent from '../components/Recent'
import FlexBox from '../components/FlexBox'
import { CreateButton } from 'react-admin'
import AppIcon from '../assets/rco_transparent.png'

export default function Welcome(): React.ReactElement {
  return (
    <Box
      maxWidth='720px'
      width='100%'
      display='flex'
      flexDirection='column'
      padding='30px'
      margin='0 auto'>
      <FlexBox justifyContent='space-between'>
        <img src={AppIcon} style={{ height: '50px', margin: '0 auto' }} />
        <CreateButton
          color='primary'
          variant='contained'
          resource={constants.R_BATCHES}
          label='Add New Batch'
          sx={{ width: '250px', height: '50px' }}
        />
      </FlexBox>
      <FlexBox marginTop='40px' justifyContent='space-between'>
        <Recent
          label='Recent Batches'
          resource={constants.R_BATCHES}
          fields={['name', 'batchNumber'] as Array<keyof Batch>}
        />
        <Recent
          label='Recent Loans'
          defaultData={[
            { id: 1, name: 'TAPE01', loanNumber: 'MAYO' },
            { id: 2, name: 'TAPE01', loanNumber: 'DISC/23/32 ' },
            { id: 3, name: 'SMITH', loanNumber: 'REPORT/2/23' }
          ]}
          fields={['name', 'loanNumber']}
        />
      </FlexBox>
      <FlexBox marginTop='40px' justifyContent='space-between'>
        <Recent
          label='Pending Receipt Notes'
          defaultData={[
            { id: 1, name: '2023/02/12', receiptsNumber: 'RAC' },
            { id: 2, name: '2023/02/11', receiptsNumber: 'AA' },
            { id: 3, name: '2023/02/07', receiptsNumber: 'GREEN FLG' }
          ]}
          fields={['name', 'receiptsNumber']}
        />
        <Recent
          label='Hasteners Required'
          defaultData={[
            { id: 1, name: '2023/02/11', hastenersNumber: 'RAC' },
            { id: 2, name: '2023/02/15', hastenersNumber: 'AA' },
            { id: 3, name: '2023/02/19', hastenersNumber: 'GREEN FLG' }
          ]}
          fields={['name', 'hastenersNumber']}
        />
      </FlexBox>
    </Box>
  )
}
