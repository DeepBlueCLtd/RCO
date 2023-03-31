import {
  Datagrid,
  DeleteButton,
  EditButton,
  List,
  TextField
} from 'react-admin'
import SourceField from '../../components/SourceField'

export default function ItemList(): React.ReactElement {
  return (
    <List hasCreate={false}>
      <Datagrid rowClick='show'>
        <TextField source='id' />
        <TextField source='start' />
        <TextField source='end' />
        <TextField source='vault_location' />
        <TextField source='remarks' />
        <SourceField
          source='protective_marking'
          reference='protective-marking'
        />
        <EditButton />
        <DeleteButton />
      </Datagrid>
    </List>
  )
}
