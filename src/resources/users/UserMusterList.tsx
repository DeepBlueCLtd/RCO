import React from 'react'
import Printable from '../../components/Printable'
import { Box, Typography } from '@mui/material'
import {
  TextField,
  useListContext,
  Show,
  Count,
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

const style = { fontSize: '12px' }

const Title = (): React.ReactElement => {
  const record = useRecordContext()
  return (
    <Typography fontSize='18px' variant='h4' textAlign='center' margin='10px'>
      VAL - Loans to {record.name}
    </Typography>
  )
}

const Header = ({
  configData
}: {
  configData: ConfigData | undefined
}): React.ReactElement => {
  return (
    <Box textAlign='center' marginBottom={2}>
      <Typography variant='h4'>{configData?.headerMarking}</Typography>
    </Box>
  )
}

const Footer = ({
  configData
}: {
  configData: ConfigData | undefined
}): React.ReactElement => {
  return (
    <Box position='absolute' bottom={0} textAlign='center' width='100%'>
      <Typography variant='caption'>{configData?.headerMarking}</Typography>
    </Box>
  )
}

export default function UserMusterList<T extends User>(
  props: Props
): React.ReactElement {
  const { open, onClose } = props
  const { selectedIds } = useListContext()
  const userIds: number[] = selectedIds
  const configData = useConfigData()

  return (
    <Printable open={open} onClose={onClose}>
      <>
        <Header configData={configData} />
        {userIds.map((userId, index) => {
          return (
            <React.Fragment key={userId}>
              <Box padding={'20px'} key={index}>
                <Show<T>
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
                  <TextField<Item>
                    {...style}
                    source='itemNumber'
                    label='Item Number'
                  />
                  <SourceField<Item>
                    textProps={{ ...style }}
                    link='show'
                    source='mediaType'
                    reference={constants.R_MEDIA_TYPE}
                    label='Media type'
                  />
                  <SourceField<Item>
                    textProps={{ ...style }}
                    source='protectiveMarking'
                    reference={constants.R_PROTECTIVE_MARKING}
                  />
                  <DateField<Item>
                    {...style}
                    source='loanedDate'
                    label='Loaned Date'
                  />
                  <TextField<Item>
                    {...style}
                    source='consecSheets'
                    label='Consec/Sheets'
                  />
                </ItemsReport>
                <ReportSignature>
                  <Count
                    resource={constants.R_ITEMS}
                    {...style}
                    filter={{ loanedTo: userId }}
                  />
                </ReportSignature>
              </Box>
              {selectedIds.length !== index + 1 && (
                <div className='pagebreak' />
              )}
            </React.Fragment>
          )
        })}
        <Footer configData={configData} />
      </>
    </Printable>
  )
}
