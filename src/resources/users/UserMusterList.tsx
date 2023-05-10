import React from 'react'
import Printable from '../../components/Printable'
import { Box, Typography } from '@mui/material'
import {
  TextField,
  useListContext,
  Show,
  BooleanField,
  Count,
  useRecordContext
} from 'react-admin'
import ItemsReport from '../items/ItemsReport'
import SourceField from '../../components/SourceField'
import * as constants from '../../constants'
import FieldWithLabel from '../../components/FieldWithLabel'
import ReportSignature from '../../components/ReportSignature'
import { DateTime } from 'luxon'

interface Props {
  open: boolean
  onClose?: () => void
}

const Title = (): React.ReactElement => {
  const record = useRecordContext()
  return (
    <Typography variant='h4' textAlign='center' margin='10px'>
      RCO - Loans to {record.name}
    </Typography>
  )
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
                <Show id={userId} resource={constants.R_USERS} actions={false}>
                  <Title />
                  <Typography variant='h5' textAlign='center' margin='10px'>
                    {
                      <Count
                        resource={constants.R_ITEMS}
                        sx={{ fontSize: '1.5rem' }}
                        filter={{ loanedTo: userId }}
                      />
                    }{' '}
                    Items Currently Booked Out{' '}
                    {DateTime.fromISO(new Date().toISOString()).toFormat(
                      'dd/MMM/yyyy HH:mm'
                    )}{' '}
                  </Typography>
                </Show>
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
                  <SourceField
                    label='Project & Platform'
                    source='batchId'
                    sourceField='project'
                    reference={constants.R_BATCHES}
                  />
                </ItemsReport>
                <ReportSignature id={userId} />
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
