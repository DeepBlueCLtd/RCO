import React from 'react'
import Printable from '../../components/Printable'
import { Box, Typography } from '@mui/material'
import { TextField, useListContext } from 'react-admin'
import ItemsReport from '../items/ItemsReport'
import SourceField from '../../components/SourceField'

interface Props {
  open: boolean
  handleOpen: (open: boolean) => React.Dispatch<boolean>
}

export default function UserMusterList(props: Props): React.ReactElement {
  const { open, handleOpen } = props
  const { selectedIds } = useListContext()

  return (
    <>
      <Printable open={open} onClose={handleOpen(false)}>
        <Box padding={'20px'}>
          <Typography variant='h4' textAlign='center' margin='10px'>
            RCO - User Muster List
          </Typography>
          <ItemsReport filter={{ loanedTo: selectedIds }}>
            <TextField source='item_number' label='Item Number' />
            <TextField source='mediaType' label='Media type' />
            <SourceField
              source='protectiveMarking'
              reference='protectiveMarking'
            />
          </ItemsReport>
        </Box>
      </Printable>
    </>
  )
}
