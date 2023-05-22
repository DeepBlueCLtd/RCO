import { Box } from '@mui/system'
import Printable from '../../components/Printable'
import {
  Count,
  Show,
  useGetList,
  useRecordContext,
  TextField
} from 'react-admin'
import {
  List,
  ListItem,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography
} from '@mui/material'
import * as constants from '../../constants'
import SourceField from '../../components/SourceField'
import FlexBox from '../../components/FlexBox'

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

const TablesData = (): React.ReactElement => {
  const record = useRecordContext()
  const { data, total } = useGetList(constants.R_ITEMS, {
    filter: {
      destruction: record.id
    }
  })

  const cellStyle = { border: '1px solid black', width: 200 }

  return (
    <Box>
      <Typography>NOTES:</Typography>
      <List
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
      </List>
      <Typography>UNIT: VAULT</Typography>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell
                align='center'
                sx={{ fontWeight: '600', border: '1px solid black' }}>
                Item
              </TableCell>
              <TableCell
                align='center'
                sx={{ fontWeight: '600', border: '1px solid black' }}>
                Media Type
              </TableCell>
              <TableCell
                align='center'
                sx={{ fontWeight: '600', border: '1px solid black' }}>
                Sri/Pages
              </TableCell>
              <TableCell
                align='center'
                sx={{ fontWeight: '600', border: '1px solid black' }}>
                Prot Marking
              </TableCell>
              <TableCell
                align='center'
                sx={{ fontWeight: '600', border: '1px solid black' }}>
                Platform
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data?.map((item, index) => {
              const { item_number: itemNumber, mediaType, platform } = item
              return (
                <TableRow key={index}>
                  <TableCell sx={cellStyle} align='center'>
                    {itemNumber}
                  </TableCell>
                  <TableCell sx={cellStyle} align='center'>
                    {mediaType}
                  </TableCell>
                  <TableCell sx={cellStyle} align='center'>
                    {}
                  </TableCell>
                  <TableCell sx={cellStyle} align='center'>
                    <SourceField
                      reference={constants.R_PROTECTIVE_MARKING}
                      source='protectiveMarking'
                    />
                  </TableCell>
                  <TableCell sx={cellStyle} align='center'>
                    {platform}
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </TableContainer>
      <Typography
        sx={{
          margin: '20px 0'
        }}>
        It is certified that the {total} above mentioned item(s) of{' '}
        {record.reference} has been destroyed in the presence of:-
      </Typography>
      <TableContainer>
        <Table>
          <TableBody>
            <TableRow>
              <TableCell sx={cellStyle} align='center'>
                Signature
              </TableCell>
              <TableCell sx={cellStyle} align='center'></TableCell>
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
              <TableCell sx={cellStyle} align='center'>
                Date
              </TableCell>
              <TableCell sx={cellStyle} align='center'></TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>

      <Typography
        sx={{
          margin: '20px 0'
        }}>
        See Note 2
        ---------------------------------------------------------------------------------------------------------
      </Typography>

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
    </Box>
  )
}

interface Props {
  open: boolean
  handleOpen: (open: boolean) => void
}

export default function DestructionReport(props: Props): React.ReactElement {
  const { open, handleOpen } = props

  return (
    <Printable open={open} onClose={() => { handleOpen(false) }}>
      <Box padding={'20px'}>
        <Show component={'div'}>
          <Typography variant='h5' textAlign='center' margin='10px'>
            <TextField source='reference' />
          </Typography>
          <Typography variant='h6' textAlign='center' margin='10px'>
            CERTIFICATE OF DESTRUCTION OF DOCUMENTS
          </Typography>
        </Show>
        <Show component={'div'} resource={constants.R_DESTRUCTION}>
          <ItemsCount />
          <TablesData />
        </Show>
      </Box>
    </Printable>
  )
}
