import Printable from '../../components/Printable'
import { Show, TextField, useRecordContext } from 'react-admin'
import { Box, Typography } from '@mui/material'
import ItemsReport from '../items/ItemsReport'
import SourceField from '../../components/SourceField'
import * as constants from '../../constants'
import FlexBox from '../../components/FlexBox'
import FieldWithLabel from '../../components/FieldWithLabel'

const DispatchDetail = (): React.ReactElement => {
  return (
    <Box>
      <FieldWithLabel label='Serial No.' source='reference' />
      <FieldWithLabel label='From' source='createdAt' />
      <FieldWithLabel label='Date' source='createdAt' />
      <FieldWithLabel label='To' source='toName' />
    </Box>
  )
}

const ItemListBox = (): React.ReactElement => {
  const { id } = useRecordContext<Dispatch>()
  return (
    <>
      <Typography
        sx={{
          textDecoration: 'underline',
          textAlign: 'center',
          marginBottom: 5
        }}>
        DETAILS OF ITEMS TRANSMITTED
      </Typography>
      <ItemsReport
        filter={{
          dispatched: id
        }}>
        <TextField source='item_number' />
        <TextField source='mediaType' />
        <TextField source='consecPages' label='Consec/Sheets' />
        <SourceField
          reference={constants.R_PROTECTIVE_MARKING}
          source='protectiveMarking'
          label='Prot Mk'
        />
      </ItemsReport>
    </>
  )
}

const SignatureBox = (): React.ReactElement => {
  return (
    <Box>
      <Typography
        align='center'
        sx={{
          textDecoration: 'underline',
          marginBottom: 5
        }}>
        PLEASE SIGN AND RETURN IMMEDIATELY
      </Typography>
      <FlexBox flexDirection={'column'} alignItems={'flex-start'} gap={1}>
        <Typography>
          SIGNED
          ....................................................................
        </Typography>
        <Typography>
          NAME (IN BLOCK
          LETTERS)....................................................................
        </Typography>
      </FlexBox>
    </Box>
  )
}

interface Props {
  open: boolean
  handleOpen: (open: boolean) => void
}

export default function DispatchReport(props: Props): React.ReactElement {
  const { open, handleOpen } = props

  return (
    <Printable
      open={open}
      onClose={() => {
        handleOpen(false)
      }}>
      <Box padding={'20px'}>
        <Show component={'div'}>
          <Typography
            sx={{ textDecoration: 'underline' }}
            variant='h6'
            align='center'
            margin='10px'>
            RECEIPT NOTE
          </Typography>
          <DispatchDetail />
          <ItemListBox />
          <SignatureBox />
        </Show>
      </Box>
    </Printable>
  )
}
