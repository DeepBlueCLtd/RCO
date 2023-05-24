import { Datagrid, DateField, List, TextField } from 'react-admin'
import SourceField from '../../components/SourceField'
import { R_ADDRESSES } from '../../constants'

export default function DispatchList(): React.ReactElement {
  return (
    <List hasCreate>
      <Datagrid rowClick='show'>
        <SourceField
          source='toAddress'
          reference={R_ADDRESSES}
          sourceField='fullAddress'
        />
        <DateField source='createdAt' />
        <TextField source='remarks' />
      </Datagrid>
    </List>
  )
}
