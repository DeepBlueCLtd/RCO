import {
  BooleanField,
  Datagrid,
  DateField,
  List,
  SearchInput,
  TextField
} from 'react-admin'
import { R_ADDRESSES } from '../../constants'
import { Typography } from '@mui/material'

const filters = [<SearchInput source='q' key='q' alwaysOn />]

export default function AddressList(): React.ReactElement {
  return (
    <List resource={R_ADDRESSES} hasCreate filters={filters} exporter={false}>
      <Typography variant='h5' fontWeight={'bold'} style={{ padding: ' 15px' }}>
        Addresses
      </Typography>
      <Datagrid rowClick='show' bulkActionButtons={<></>}>
        <TextField<Address> source='fullAddress' />
        <BooleanField<Address> source='active' looseValue />
        <DateField<Address> source='createdAt' />
        <TextField<Address> source='remarks' />
      </Datagrid>
    </List>
  )
}
