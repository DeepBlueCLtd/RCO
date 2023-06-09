import React, { useState } from 'react'
import {
  CreateButton,
  EditButton,
  Show,
  TabbedShowLayout,
  TopToolbar,
  FilterButton,
  SelectColumnsButton,
  DateField,
  useShowContext,
  DatagridConfigurable,
  type DatagridConfigurableProps,
  TextField
} from 'react-admin'
import { useParams } from 'react-router-dom'
import * as constants from '../../constants'
import { ICON_ITEM, ICON_DETAILS } from '../../constants'
import ItemList, { BulkActions } from '../items/ItemList'
import TopToolbarField from '../../components/TopToolbarField'
import { ItemAssetReport } from '../items/ItemsReport'
import { IconButton, Typography } from '@mui/material'
import useCanAccess from '../../hooks/useCanAccess'
import ResourceHistoryModal from '../../components/ResourceHistory'
import { History } from '@mui/icons-material'
import SourceField from '../../components/SourceField'
import BatchForm from './BatchForm'

export interface ShowActionProps {
  handleOpen: (open: boolean) => void
}

const ShowActions = ({ handleOpen }: ShowActionProps): React.ReactElement => {
  const { hasAccess } = useCanAccess()
  return (
    <TopToolbar sx={{ alignItems: 'center' }}>
      <TopToolbarField source='batchNumber' />
      {hasAccess(constants.R_BATCHES, { write: true }) && <EditButton />}
      <IconButton
        onClick={() => {
          handleOpen(true)
        }}>
        <History />
      </IconButton>
    </TopToolbar>
  )
}

const ItemActions = (): React.ReactElement => {
  const { id = '' } = useParams()
  const { hasAccess } = useCanAccess()
  const batchId: string = id

  return (
    <TopToolbar>
      {hasAccess(constants.R_ITEMS, { write: true }) ? (
        <CreateButton
          label='ADD ITEM'
          to={`/${constants.R_ITEMS}/create?batch=${batchId}`}
        />
      ) : null}
      <ItemAssetReport
        storeKey='batch-items-report'
        filterDefaultValues={{ batchId }}
      />
      <FilterButton />
      <SelectColumnsButton />
    </TopToolbar>
  )
}

export interface HistoryProps {
  handleOpen: (open: boolean) => void
  open: boolean
}

const HistoryModal = ({
  handleOpen,
  open
}: HistoryProps): React.ReactElement => {
  const { record } = useShowContext<Batch>()
  if (record === undefined) return <></>
  const filter = { dataId: record.id, resource: constants.R_BATCHES }
  return (
    <ResourceHistoryModal
      open={open}
      close={() => {
        handleOpen(false)
      }}
      filter={filter}
    />
  )
}

export default function BatchShow(): React.ReactElement {
  const { id } = useParams()
  const pageTitle = 'Batch Show'
  const [open, setOpen] = useState(false)

  const handleOpen = (open: boolean): void => {
    setOpen(open)
  }

  return (
    <Show actions={<ShowActions handleOpen={handleOpen} />}>
      <Typography variant='h5' fontWeight='bold' sx={{ padding: '15px' }}>
        <constants.ICON_BATCH /> {pageTitle}
      </Typography>
      <TabbedShowLayout sx={{ paddingBottom: '4px' }}>
        <TabbedShowLayout.Tab label='Details' icon={<ICON_DETAILS />}>
          <BatchForm isShow />
        </TabbedShowLayout.Tab>
        <TabbedShowLayout.Tab label='Items' icon={<ICON_ITEM />}>
          <ItemList
            storeKey={`${constants.R_BATCHES}-${id}-items-list`}
            empty={false}
            filter={{ batchId: id }}
            actions={<ItemActions />}
            disableSyncWithLocation>
            <ItemListDataTable
              preferenceKey={`datagrid-${constants.R_BATCHES}-${id}-items-list`}
            />
          </ItemList>
        </TabbedShowLayout.Tab>
      </TabbedShowLayout>
      <HistoryModal handleOpen={handleOpen} open={open} />
    </Show>
  )
}

function ItemListDataTable(
  props: DatagridConfigurableProps
): React.ReactElement {
  return (
    <DatagridConfigurable
      bulkActionButtons={<BulkActions />}
      rowClick='show'
      omit={props?.omit}
      preferenceKey={props.preferenceKey}
      {...props}>
      <TextField source='item_number' label='Reference' />
      <SourceField
        link='show'
        source='mediaType'
        reference={constants.R_MEDIA_TYPE}
        label='Media type'
      />
      <SourceField source='protectiveMarking' reference='protectiveMarking' />
      <TextField source='remarks' />
      <SourceField
        link='show'
        source='loanedTo'
        reference={constants.R_USERS}
        label='Loaned to'
      />
      <SourceField
        link='show'
        source='destruction'
        reference={constants.R_DESTRUCTION}
        sourceField='reference'
      />
      <DateField source='destructionDate' />
      <SourceField
        link='show'
        source='dispatchJob'
        reference={constants.R_DISPATCH}
        sourceField='reference'
        label='Dispatch Job'
      />
      <DateField source='dispatchedDate' />
    </DatagridConfigurable>
  )
}
