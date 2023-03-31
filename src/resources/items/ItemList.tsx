import { Datagrid, DateField, List, TextField } from 'react-admin'
import SourceField from '../../components/SourceField'

export default function ItemList(): React.ReactElement {
  return (
    <List>
      <Datagrid rowClick='show'>
        <TextField source='id' />
        <DateField source='start' />
        <DateField source='end' />
        <TextField source='vault_location' />
        <TextField source='remarks' />
        <SourceField source='protective_marking' />
      </Datagrid>
    </List>
  )
}
