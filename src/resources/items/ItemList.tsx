import {
  DatagridConfigurable,
  DateField,
  DateInput,
  EditButton,
  FilterButton,
  List,
  SearchInput,
  SelectColumnsButton,
  SelectInput,
  TextField,
  TextInput,
  TopToolbar
} from 'react-admin'
import SourceField from '../../components/SourceField'
import SourceInput from '../../components/SourceInput'
import { mediaTypeOptions } from '../../utils/media'
import constants from '../../constants'

const sort = (field = 'name') => ({ field, order: 'ASC' })

const filters = [
  <SearchInput source='q' key='q' alwaysOn />,
  <TextInput source='item_number' key='item_number' label='Reference' />,
  <SelectInput source='mediaType' key='mediaType' choices={mediaTypeOptions} />,
  // <SourceNestedFilterInput
  //   key='batch.project'
  //   source='batch.project'
  //   reference= {constants.R_PROJECTS}
  //   label='Project'
  //   child={{ source: 'project', reference: constants.R_PROJECTS }}
  // />,
  <DateInput source='start' key='start' />,
  <DateInput source='end' key='end' />,
  <SourceInput
    source='vaultLocation'
    key='vaultLocation'
    sort={sort()}
    reference='vaultLocation'
  />,
  <SourceInput
    source='protectiveMarking'
    key='protectiveMarking'
    sort={sort()}
    reference='protectiveMarking'
  />,
  <SourceInput
    source='batchId'
    key='batchId'
    sort={sort('batchNumber')}
    reference={constants.R_BATCHES}
    optionField='batchNumber'
  />,
  <TextInput key='remarks' source='remarks' />
]

const ItemActions = () => (
  <TopToolbar>
    <FilterButton />
    <SelectColumnsButton />
  </TopToolbar>
)

export default function ItemList(): React.ReactElement {
  return (
    <List hasCreate={false} actions={<ItemActions />} filters={filters}>
      <DatagridConfigurable rowClick='show'>
        <TextField source='id' />
        <TextField source='createdAt' label='Created' />
        <TextField source='item_number' label='Reference' />
        <TextField source='mediaType' label='Media type' />
        <DateField source='start' />
        <DateField source='end' />
        <SourceField source='vaultLocation' reference='vaultLocation' />
        <SourceField source='protectiveMarking' reference='protectiveMarking' />
        <TextField source='remarks' />
        <EditButton />
      </DatagridConfigurable>
    </List>
  )
}
