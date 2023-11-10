import React from 'react'
import Printable from '../../components/Printable'
import { Box, Table, TableFooter, TableHead, Typography } from '@mui/material'
import {
  TextField,
  useListContext,
  Show,
  Count,
  useRecordContext,
  DateField,
  ReferenceField,
  FunctionField
} from 'react-admin'
import ItemsReport from '../items/ItemsReport'
import SourceField from '../../components/SourceField'
import * as constants from '../../constants'
import ReportSignature from '../../components/ReportSignature'
import { DateTime } from 'luxon'
import { useConfigData } from '../../utils/useConfigData'
import { Footer, Header } from '../../components/VaultLocationReport'
import { ItemName } from '../audit/AuditList'

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
    <ReferenceField
      label={label}
      source='batch'
      reference={constants.R_BATCHES}>
      <ReferenceField source='project' reference={constants.R_PROJECTS}>
        <SourceField<Project>
          textProps={{ ...style }}
          source='id'
          reference={constants.R_PROJECTS}
        />
      </ReferenceField>
      {' / '}
      <ReferenceField source='platform' reference={constants.R_PLATFORMS}>
        <SourceField<Platform>
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
      VAL - Loans to {record.name}
    </Typography>
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
        {userIds.map((userId, index) => {
          return (
            <React.Fragment key={userId}>
              <Table>
                <TableHead>
                  <Header configData={configData} />
                </TableHead>

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
                    <FunctionField<RichItem>
                      render={(record) => <ItemName id={record.id} />}
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
                    <CompositeField
                      {...style}
                      label={`${configData?.projectName} & Platform`}
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
                <TableFooter>
                  <Footer configData={configData} />
                </TableFooter>
              </Table>
            </React.Fragment>
          )
        })}
      </>
    </Printable>
  )
}
