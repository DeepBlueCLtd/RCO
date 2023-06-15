import { Show, TextField } from 'react-admin'
import FieldWithLabel from '../../components/FieldWithLabel'
import { Typography } from '@mui/material'
import ItemsReport from '../items/ItemsReport'
import SourceField from '../../components/SourceField'
import * as constants from '../../constants'
import { useParams } from 'react-router-dom'
import { Box } from '@mui/system'
import FlexBox from '../../components/FlexBox'
import { useConfigData } from '../../utils/useConfigData'

const DispatchDetail = (): React.ReactElement => {
  const configData = useConfigData()

  return (
    <Show component={'div'} actions={<></>} sx={{ marginBottom: '10px' }}>
      <FieldWithLabel
        label='Serial No.'
        source='reference'
        labelStyles={{ fontSize: '1rem' }}
        textProps={{ variant: 'h6', sx: { fontSize: '1rem' } }}
      />
      <Box fontWeight='bold'>
        <Typography fontWeight='bold'>
          From:
          <span style={{ fontSize: '1rem', fontWeight: 'normal' }}>
            &nbsp;{configData?.fromAddress}
          </span>
        </Typography>
      </Box>
      <FieldWithLabel
        label='Date'
        source='createdAt'
        labelStyles={{ fontSize: '1rem' }}
        textProps={{ variant: 'h6', sx: { fontSize: '1rem' } }}
      />
      <FieldWithLabel
        sourceField='fullAddress'
        label='To'
        source='toAddress'
        reference={constants.R_ADDRESSES}
        textProps={{ variant: 'h6', sx: { fontSize: '1rem' } }}
      />
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
          dispatchJob: id
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
        <Typography>
          DATE
          ....................................................................
        </Typography>
      </FlexBox>
    </Box>
  )
}

interface ReportDataType {
  title?: string
}

export default function ReportData({
  title
}: ReportDataType): React.ReactElement {
  return (
    <Box padding={'20px'}>
      <Typography
        sx={{ textDecoration: 'underline' }}
        variant='h6'
        align='center'
        margin='10px'>
        {title !== undefined ? title : 'RECEIPT NOTE'}
      </Typography>
      <DispatchDetail />
      <ItemListBox />
      <SignatureBox />
    </Box>
  )
}
