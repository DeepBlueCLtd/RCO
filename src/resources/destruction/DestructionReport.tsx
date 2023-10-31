import { Box } from '@mui/system'
import Printable from '../../components/Printable'
import {
  Count,
  Show,
  useGetList,
  useRecordContext,
  TextField,
  ReferenceField,
  type Identifier,
  FunctionField
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
import { useConfigData } from '../../utils/useConfigData'

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
        <TextField<Item> source='itemNumber' />
        <SourceField<Item>
          link='show'
          source='mediaType'
          reference={constants.R_MEDIA_TYPE}
          label='Media type'
        />
        <TextField<Item> source='consecSheets' label='Srl/Pages' />
        <SourceField<Item>
          reference={constants.R_PROTECTIVE_MARKING}
          source='protectiveMarking'
        />
        <ReferenceField<Item>
          label='Platform'
          reference={constants.R_BATCHES}
          source='batch'>
          <ReferenceField<Batch>
            reference={constants.R_PLATFORMS}
            source='platform'>
            <TextField<Platform> source='name' />
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

const TablesData = ({
  prefix
}: {
  prefix: string | undefined
}): React.ReactElement => {
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
        {`${prefix}/${record.name}`} has been destroyed in the presence of:-
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
  const configData = useConfigData()

  return (
    <Printable
      {...rest}
      onClose={() => {
        handleOpen('')
      }}>
      <Box padding={'20px'}>
        <Show component={'div'} actions={false}>
          <Typography variant='h5' textAlign='center' margin='10px'>
            <FunctionField<Destruction>
              source='name'
              render={(record) => {
                return <>{`${configData?.reportPrefix}/${record.name}`}</>
              }}
            />
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
          <TablesData prefix={configData?.reportPrefix} />
        </Show>
      </Box>
    </Printable>
  )
}
