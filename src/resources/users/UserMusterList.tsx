import React from 'react'
import Printable from '../../components/Printable'
import { Box, Typography } from '@mui/material'
import {
  TextField,
  useListContext,
  Show,
  BooleanField,
  Count,
  ReferenceField,
  useRecordContext,
  DateField
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

interface CompositeFieldProps {
  label: string
}

const CompositeField = (props: CompositeFieldProps): React.ReactElement => {
  const { label } = props
  return (
    <ReferenceField
      label={label}
      source='batchId'
      reference={constants.R_ITEMS}>
      <ReferenceField source='id' reference={constants.R_BATCHES}>
        <SourceField source='id' reference={constants.R_PROJECTS} />,{' '}
        <SourceField source='id' reference={constants.R_PLATFORMS} />
      </ReferenceField>
    </ReferenceField>
  )
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
              <Box padding={'20px'} key={index}>
                <Show
                  component={'div'}
                  id={userId}
                  resource={constants.R_USERS}
                  actions={false}>
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
                    {DateTime.now().toFormat(constants.DATETIME_FORMAT)}
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
                  <CompositeField label='Project & Platform' />
                  <DateField source='loanedDate' label='Loaned Date' />
                  <TextField source='consecPages' label='Consec/Pages' />
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
