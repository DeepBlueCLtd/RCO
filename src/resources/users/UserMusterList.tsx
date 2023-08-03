import React from 'react'
import Printable from '../../components/Printable'
import { Box, Typography } from '@mui/material'
import {
  TextField,
  useListContext,
  Show,
  Count,
  ReferenceField,
  useRecordContext,
  DateField
} from 'react-admin'
import ItemsReport from '../items/ItemsReport'
import SourceField from '../../components/SourceField'
import * as constants from '../../constants'
import ReportSignature from '../../components/ReportSignature'
import { DateTime } from 'luxon'
import { useConfigData } from '../../utils/useConfigData'

interface Props {
  open: boolean
  onClose?: () => void
}

interface CompositeFieldProps {
  label: string
}

const style = { fontSize: '12px' }

const CompositeField = (props: CompositeFieldProps): React.ReactElement => {
  const { label } = props
  return (
    <ReferenceField label={label} source='batch' reference={constants.R_ITEMS}>
      <ReferenceField source='id' reference={constants.R_BATCHES}>
        <SourceField
          textProps={{ ...style }}
          source='id'
          reference={constants.R_PROJECTS}
        />
        ,{' '}
        <SourceField
          textProps={{ ...style }}
          source='id'
          reference={constants.R_PLATFORMS}
        />
      </ReferenceField>
    </ReferenceField>
  )
}

const Title = (): React.ReactElement => {
  const record = useRecordContext()
  return (
    <Typography fontSize='18px' variant='h4' textAlign='center' margin='10px'>
      RCO - Loans to {record.name}
    </Typography>
  )
}

export default function UserMusterList(props: Props): React.ReactElement {
  const { open, onClose } = props
  const { selectedIds } = useListContext()
  const userIds: number[] = selectedIds
  const configData = useConfigData()

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
                  <Typography
                    fontSize='16px'
                    variant='h5'
                    textAlign='center'
                    margin='10px'>
                    {
                      <Count
                        resource={constants.R_ITEMS}
                        sx={{ fontSize: '16px' }}
                        filter={{ loanedTo: userId }}
                      />
                    }{' '}
                    Items Currently Booked Out{' '}
                    {DateTime.now().toFormat(constants.DATETIME_FORMAT)}
                  </Typography>
                </Show>
                <ItemsReport
                  filter={{ loanedTo: userId }}
                  sx={{
                    '.MuiTableCell-head span': {
                      fontSize: '12px'
                    }
                  }}
                  headStyle={{
                    fontSize: '12px'
                  }}>
                  <TextField
                    {...style}
                    source='itemNumber'
                    label='Item Number'
                  />
                  <SourceField
                    textProps={{ ...style }}
                    link='show'
                    source='mediaType'
                    reference={constants.R_MEDIA_TYPE}
                    label='Media type'
                  />
                  <SourceField
                    textProps={{ ...style }}
                    source='protectiveMarking'
                    reference={constants.R_PROTECTIVE_MARKING}
                  />
                  <CompositeField
                    {...style}
                    label={`${configData?.projectName} & Platform`}
                  />
                  <DateField
                    {...style}
                    source='loanedDate'
                    label='Loaned Date'
                  />
                  <TextField
                    {...style}
                    source='consecPages'
                    label='Consec/Pages'
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
