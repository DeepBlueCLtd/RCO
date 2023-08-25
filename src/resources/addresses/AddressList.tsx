import { BooleanField, Datagrid, DateField, List, TextField } from 'react-admin'
import { R_ADDRESSES } from '../../constants'

export default function AddressList(): React.ReactElement {
  return (
    <List resource={R_ADDRESSES} hasCreate>
      <Datagrid rowClick='show'>
        <TextField<Address> source='fullAddress' />
        <BooleanField<Address> source='active' looseValue />
        <DateField<Address> source='createdAt' />
        <TextField<Address> source='Remarks' />
      </Datagrid>
    </List>
  )
}
