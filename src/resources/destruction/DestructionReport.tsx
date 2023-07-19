import { Box } from '@mui/system'
import Printable from '../../components/Printable'
import {
  Count,
  Show,
  useGetList,
  useRecordContext,
  TextField,
  ReferenceField,
  type Identifier
} from 'react-admin'
import {
  List as MuiList,
  ListItem,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Typography
} from '@mui/material'
import * as constants from '../../constants'
import FlexBox from '../../components/FlexBox'
import ItemsReport from '../items/ItemsReport'
import SourceField from '../../components/SourceField'
import React from 'react'
import { type DestructionModal } from './DestructionShow'

const ItemsCount = (): React.ReactElement => {
  const record = useRecordContext()
  return (
    <Typography variant='h5' textAlign='center' margin='10px'>
      {
        <Count
          resource={constants.R_ITEMS}
          sx={{ fontSize: '1.5rem' }}
          filter={{ destruction: record.id }}
        />
      }{' '}
      ITEMS
    </Typography>
  )
}

const Notes = (): React.ReactElement => {
  return (
    <Box>
      <Typography>NOTES:</Typography>
      <MuiList
        sx={{
          listStyleType: 'decimal',
          pl: 2,
          '& .MuiListItem-root': {
            display: 'list-item',
            py: 0
          }
        }}>
        <ListItem>
          <Typography>
            To be completed and retained in accordance with regulations
          </Typography>
        </ListItem>
        <ListItem>
          <Typography>
            If the authority for destruction is not one of the signatories below
            the additional details at the foot of the form should be completed.
          </Typography>
        </ListItem>
      </MuiList>
    </Box>
  )
}

interface ItemsListBoxProps {
  recordId: Identifier
}

const ItemsListBox = (props: ItemsListBoxProps): React.ReactElement => {
  const { recordId } = props
  return (
    <Box>
      <Typography>UNIT: VAULT</Typography>
      <ItemsReport
        filter={{
          destruction: recordId
        }}>
        <TextField source='item_number' />
        <SourceField
          link='show'
          source='mediaType'
          reference={constants.R_MEDIA_TYPE}
          label='Media type'
        />
        <TextField source='consecPages' label='Srl/Pages' />
        <SourceField
          reference={constants.R_PROTECTIVE_MARKING}
          source='protectiveMarking'
        />
        <ReferenceField
          label='Platform'
          reference={constants.R_BATCHES}
          source='batchId'>
          <ReferenceField reference={constants.R_PLATFORMS} source='platform'>
            <TextField source='name' />
          </ReferenceField>
        </ReferenceField>
      </ItemsReport>
    </Box>
  )
}

const cellStyle = { border: '1px solid black', width: 200 }

interface SignatureProps {
  cellStyle?: Record<string, any>
}

const Signature = (props: SignatureProps): React.ReactElement => {
  const { cellStyle } = props

  return (
    <Table>
      <TableBody>
        <TableRow>
          <TableCell sx={cellStyle} align='center'>
            Signature
          </TableCell>
          <TableCell sx={cellStyle} align='center'></TableCell>
        </TableRow>
        <TableRow>
          <TableCell sx={cellStyle} align='center'>
            Name (Block letters)
          </TableCell>
          <TableCell sx={cellStyle} align='center'></TableCell>
        </TableRow>
        <TableRow>
          <TableCell sx={cellStyle} align='center'>
            Grade
          </TableCell>
          <TableCell sx={cellStyle} align='center'></TableCell>
        </TableRow>
        <TableRow>
          <TableCell sx={cellStyle} align='center'>
            Date
          </TableCell>
          <TableCell sx={cellStyle} align='center'></TableCell>
        </TableRow>
      </TableBody>
    </Table>
  )
}

const AuthoritySignature = (): React.ReactElement => {
  return (
    <FlexBox alignItems={'start'}>
      <TableContainer>
        <Table>
          <TableBody>
            <TableRow>
              <TableCell sx={cellStyle} align='center'>
                Signature of Authority
              </TableCell>
              <TableCell sx={cellStyle} align='center'></TableCell>
            </TableRow>
            <TableRow>
              <TableCell sx={cellStyle} align='center'>
                Name (block letters)
              </TableCell>
              <TableCell sx={cellStyle} align='center'></TableCell>
            </TableRow>
            <TableRow>
              <TableCell sx={cellStyle} align='center'>
                Grade/Rank
              </TableCell>
              <TableCell sx={cellStyle} align='center'></TableCell>
            </TableRow>
            <TableRow>
              <TableCell sx={cellStyle} align='center'>
                Date
              </TableCell>
              <TableCell sx={cellStyle} align='center'></TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
      <TableContainer>
        <Table>
          <TableBody>
            <TableRow>
              <TableCell sx={cellStyle} align='center'>
                Details of document authorising destruction OR document ref
              </TableCell>
              <TableCell sx={cellStyle} align='center'></TableCell>
            </TableRow>
            <TableRow>
              <TableCell sx={cellStyle} align='center'>
                Date
              </TableCell>
              <TableCell sx={cellStyle} align='center'></TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
    </FlexBox>
  )
}

const SignatureForms = (): React.ReactElement => {
  return (
    <Box>
      <TableContainer>
        <FlexBox gap={0}>
          <Signature
            cellStyle={{
              ...cellStyle,
              borderRight: 'none'
            }}
          />
          <Signature cellStyle={cellStyle} />
        </FlexBox>
      </TableContainer>
      <Typography
        sx={{
          margin: '20px 0'
        }}>
        See Note 2
        ---------------------------------------------------------------------------------------------------------
      </Typography>
      <AuthoritySignature />
    </Box>
  )
}

const TablesData = (): React.ReactElement => {
  const record = useRecordContext()
  const { total } = useGetList(constants.R_ITEMS, {
    filter: {
      destruction: record.id
    }
  })

  return (
    <Box>
      <Notes />
      <ItemsListBox recordId={record.id} />
      <Typography
        sx={{
          margin: '20px 0'
        }}>
        It is certified that the {total} above mentioned item(s) of{' '}
        {record.reference} has been destroyed in the presence of:-
      </Typography>
      <SignatureForms />
    </Box>
  )
}

interface Props {
  open: boolean
  handleOpen: (open: DestructionModal) => void
  onPrint?: () => void
}

export default function DestructionReport(props: Props): React.ReactElement {
  const { handleOpen, ...rest } = props

  return (
    <Printable
      {...rest}
      onClose={() => {
        handleOpen('')
      }}>
      <Box padding={'20px'}>
        <Show component={'div'} actions={false}>
          <Typography variant='h5' textAlign='center' margin='10px'>
            <TextField source='reference' />
          </Typography>
          <Typography variant='h6' textAlign='center' margin='10px'>
            CERTIFICATE OF DESTRUCTION OF DOCUMENTS
          </Typography>
        </Show>
        <Show
          component={'div'}
          actions={false}
          resource={constants.R_DESTRUCTION}>
          <ItemsCount />
          <TablesData />
        </Show>
      </Box>
    </Printable>
  )
}
