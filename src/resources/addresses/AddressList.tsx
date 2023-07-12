import { BooleanField, Datagrid, DateField, List, TextField } from 'react-admin'
import { R_ADDRESSES } from '../../constants'

export default function AddressList(): React.ReactElement {
  return (
    <List resource={R_ADDRESSES} hasCreate>
      <Datagrid rowClick='show'>
        <TextField source='fullAddress' />
        <BooleanField source='active' looseValue />
        <DateField source='createdAt' />
        <TextField source='remarks' />
      </Datagrid>
    </List>
  )
}
