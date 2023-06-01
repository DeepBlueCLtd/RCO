import { Show, TextField } from 'react-admin'
import FieldWithLabel from '../../components/FieldWithLabel'
import { Typography } from '@mui/material'
import ItemsReport from '../items/ItemsReport'
import SourceField from '../../components/SourceField'
import * as constants from '../../constants'
import { useParams } from 'react-router-dom'
import { Box } from '@mui/system'
import FlexBox from '../../components/FlexBox'

const DispatchDetail = (): React.ReactElement => {
  return (
    <Show component={'div'} actions={<></>}>
      <FieldWithLabel label='Serial No.' source='reference' />
      <FieldWithLabel label='From' source='createdAt' />
      <FieldWithLabel label='Date' source='createdAt' />
      <FieldWithLabel label='To' source='toName' />
    </Show>
  )
}

const ItemListBox = (): React.ReactElement => {
  const { id } = useParams()
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

export default function ReportData(): React.ReactElement {
  return (
    <Box padding={'20px'}>
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
    </Box>
  )
}
