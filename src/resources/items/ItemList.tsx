import {
  Datagrid,
  DateField,
  DateInput,
  DeleteButton,
  EditButton,
  List,
  SearchInput,
  SelectInput,
  TextField,
  TextInput
} from 'react-admin'
import SourceField from '../../components/SourceField'
import SourceInput from '../../components/SourceInput'
import { mediaTypeOptions } from '../../utils/media'

const sort = (field = 'name') => ({ field, order: 'ASC' })

const filters = [
  <SearchInput source='q' key='q' alwaysOn />,
  <TextInput source='item_number' key='item_number' label='Reference' />,
  <SelectInput
    source='media_type'
    key='media_type'
    choices={mediaTypeOptions}
  />,
  <DateInput source='start' key='start' />,
  <DateInput source='end' key='end' />,
  <SourceInput
    source='vault_location'
    key='vault_location'
    sort={sort()}
    reference='vault-location'
  />,
  <SourceInput
    source='protective_marking'
    key='protective_marking'
    sort={sort()}
    reference='protective-marking'
  />,
  <SourceInput
    source='batch_id'
    key='batch_id'
    sort={sort('batch_number')}
    reference='batches'
    optionField='batch_number'
  />,
  <TextInput key='remarks' source='remarks' />
]

export default function ItemList(): React.ReactElement {
  return (
    <List hasCreate={false} filters={filters}>
      <Datagrid rowClick='show'>
        <TextField source='id' />
        <TextField source='item_number' label='Reference' />
        <TextField source='media_type' label='Media type' />
        <DateField source='start' />
        <DateField source='end' />
        <SourceField source='vault_location' reference='vault-location' />
        <SourceField
          source='protective_marking'
          reference='protective-marking'
        />
        <TextField source='remarks' />
        <EditButton />
        <DeleteButton />
      </Datagrid>
    </List>
  )
}
