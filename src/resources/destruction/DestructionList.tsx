import { Datagrid, DateField, List, TextField } from 'react-admin'
import SourceField from '../../components/SourceField'
import * as constants from '../../constants'

export default function DestructionList(): React.ReactElement {
  return (
    <List>
      <Datagrid rowClick='show' bulkActionButtons={false}>
        <TextField source='reference' />
        <DateField source='createdAt' />
        <SourceField source='createdBy' reference={constants.R_USERS} />
        <DateField source='finalisedAt' />
        <SourceField source='finalisedBy' reference={constants.R_USERS} />
      </Datagrid>
    </List>
  )
}
