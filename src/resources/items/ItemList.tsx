import {
  DatagridConfigurable,
  DateField,
  DateTimeInput,
  EditButton,
  FilterButton,
  List,
  type ListProps,
  SearchInput,
  SelectColumnsButton,
  SelectInput,
  TextField,
  TextInput,
  TopToolbar,
  BulkDeleteButton,
  useListContext,
  useRefresh
} from 'react-admin'
import SourceField from '../../components/SourceField'
import SourceInput from '../../components/SourceInput'
import { mediaTypeOptions } from '../../utils/media'
import * as constants from '../../constants'
import CreatedByMeFilter from '../../components/CreatedByMeFilter'
import { Button, Modal } from '@mui/material'
import { useState } from 'react'
import FlexBox from '../../components/FlexBox'
import ChangeLocation from './ItemForm/ChangeLocation'
const sort = (field = 'name') => ({ field, order: 'ASC' })

const omitColumns: string[] = ['createdAt']

const filters = [
  <SearchInput source='q' key='q' alwaysOn />,
  <CreatedByMeFilter
    key='createdByMe'
    source='createdBy_eq'
    label='Created By Me'
  />,
  <SourceInput
    key='createdBy'
    source='createdBy'
    reference={constants.R_USERS}
  />,
  <TextInput source='item_number' key='item_number' label='Reference' />,
  <SelectInput source='mediaType' key='mediaType' choices={mediaTypeOptions} />,
  <DateTimeInput source='start' key='start' />,
  <DateTimeInput source='end' key='end' />,
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

export const BulkActions = () => {
  const { selectedIds } = useListContext()
  const [open, setOpen] = useState(false)
  const refresh = useRefresh()

  const handleClose = () => {
    setOpen(false)
  }

  const handleOpen = () => {
    setOpen(true)
  }

  const handleSuccess = () => {
    handleClose()
    refresh()
  }

  return (
    <>
      <FlexBox>
        <BulkDeleteButton mutationMode='pessimistic' />
        <Button size='small' variant='outlined' onClick={handleOpen}>
          Change Location
        </Button>
      </FlexBox>
      <Modal open={open} onClose={handleClose}>
        <ChangeLocation
          successCallback={handleSuccess}
          onCancel={handleClose}
          ids={selectedIds}
        />
      </Modal>
    </>
  )
}

export default function ItemList(
  props?: Omit<ListProps, 'children'>
): React.ReactElement {
  return (
    <List
      bulkActionButtons={<BulkActions />}
      hasCreate={false}
      actions={<ItemActions />}
      resource='items'
      filters={filters}
      {...props}>
      <DatagridConfigurable rowClick='show' omit={omitColumns}>
        <TextField source='id' />
        <TextField source='createdAt' label='Created' />
        <TextField source='item_number' label='Reference' />
        <TextField source='mediaType' label='Media type' />
        <DateField showTime source='start' />
        <DateField showTime source='end' />
        <SourceField source='vaultLocation' reference='vaultLocation' />
        <SourceField source='protectiveMarking' reference='protectiveMarking' />
        <TextField source='remarks' />
        <EditButton />
      </DatagridConfigurable>
    </List>
  )
}
