import React from 'react'
import Printable from '../../components/Printable'
import { Box, Typography } from '@mui/material'
import { TextField, useListContext, Show, BooleanField } from 'react-admin'
import ItemsReport from '../items/ItemsReport'
import SourceField from '../../components/SourceField'
import * as constants from '../../constants'
import FieldWithLabel from '../../components/FieldWithLabel'

interface Props {
  open: boolean
  onClose?: () => void
}

export default function UserMusterList(props: Props): React.ReactElement {
  const { open, onClose } = props
  const { selectedIds } = useListContext()
  const userIds: number[] = selectedIds

  return (
    <Printable open={open} onClose={onClose}>
      <>
        {userIds.map((userId, index) => {
          return (
            <>
              <Box padding={'20px'} key={userId}>
                <Typography variant='h4' textAlign='center' margin='10px'>
                  RCO - User Muster List
                </Typography>

                <Show id={userId} resource={constants.R_USERS} actions={false}>
                  <Box padding={'16px'}>
                    <FieldWithLabel label='Name' source='name' />
                    <FieldWithLabel
                      source='adminRights'
                      label='Admin Rights'
                      component={BooleanField}
                    />
                  </Box>
                </Show>
                <ItemsReport filter={{ loanedTo: userId }}>
                  <TextField source='item_number' label='Item Number' />
                  <TextField source='mediaType' label='Media type' />
                  <SourceField
                    source='protectiveMarking'
                    reference='protectiveMarking'
                  />
                </ItemsReport>
              </Box>
              {selectedIds.length !== index + 1 && (
                <div className='pagebreak' />
              )}
            </>
          )
        })}
      </>
    </Printable>
  )
}
