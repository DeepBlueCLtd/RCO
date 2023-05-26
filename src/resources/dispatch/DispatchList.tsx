import { Datagrid, DateField, List, TextField } from 'react-admin'

export default function DispatchList(): React.ReactElement {
  return (
    <List hasCreate>
      <Datagrid rowClick='show'>
        <TextField source='reference' />
        <DateField source='dispatchedAt' />
        <TextField source='toName' />
        <TextField source='remarks' />
        <TextField source='receiptReceived' />
      </Datagrid>
    </List>
  )
}
