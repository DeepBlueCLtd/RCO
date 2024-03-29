import React from 'react'
import {
  CreateButton,
  EditButton,
  Show,
  TabbedShowLayout,
  TopToolbar,
  FilterButton,
  SelectColumnsButton,
  useShowContext,
  type SelectColumnsButtonProps,
  FunctionField,
  useRedirect
} from 'react-admin'
import { useParams } from 'react-router-dom'
import * as constants from '../../constants'
import { ICON_ITEM, ICON_DETAILS } from '../../constants'
import ItemList, { BulkActions } from '../items/ItemList'
import TopToolbarField, { sx } from '../../components/TopToolbarField'
import { ItemAssetReport } from '../items/ItemsReport'
import { Typography } from '@mui/material'
import useCanAccess from '../../hooks/useCanAccess'
import BatchForm from './BatchForm'
import StyledTopToolbar from '../../components/StyledTopToolbar'
import HistoryButton from '../../components/HistoryButton'

export interface ShowActionProps {
  handleOpen: (open: boolean) => void
}

const ShowActions = (): React.ReactElement => {
  const { hasAccess } = useCanAccess()
  const { record } = useShowContext()
  const redirect = useRedirect()

  return (
    <TopToolbar sx={{ alignItems: 'center' }}>
      <TopToolbarField<Batch> source='batchNumber'>
        <FunctionField<Batch>
          sx={sx}
          render={(record) => `${record.vault?.[0]}${record.batchNumber}`}
        />
      </TopToolbarField>
      {hasAccess(constants.R_BATCHES, { write: true }) && <EditButton />}
      <HistoryButton
        onClick={() => {
          redirect(
            `/audit?filter=${JSON.stringify({
              dataId: record.id,
              resource: constants.R_BATCHES
            })}`
          )
        }}
      />
    </TopToolbar>
  )
}

const ItemActions = ({
  preferenceKey
}: SelectColumnsButtonProps): React.ReactElement => {
  const { id = '' } = useParams()
  const { hasAccess } = useCanAccess()
  const batch: string = id

  return (
    <StyledTopToolbar>
      {hasAccess(constants.R_ITEMS, { write: true }) ? (
        <CreateButton
          label='ADD ITEM'
          to={`/${constants.R_RICH_ITEMS}/create?batch=${batch}`}
        />
      ) : (
        <></>
      )}
      <ItemAssetReport
        storeKey='batch-items-report'
        filterDefaultValues={{ batch }}
      />
      <FilterButton />
      <SelectColumnsButton preferenceKey={preferenceKey} />
    </StyledTopToolbar>
  )
}

export interface HistoryProps {
  handleOpen: (open: boolean) => void
  open: boolean
}

export default function BatchShow(): React.ReactElement {
  const { id } = useParams()
  const pageTitle = 'Batch Show'
  const preferenceKey = `datagrid-${constants.R_BATCHES}-${id}-items-list`

  return (
    <Show actions={<ShowActions />}>
      <Typography variant='h5' fontWeight='bold' sx={{ padding: '15px' }}>
        <constants.ICON_BATCH /> {pageTitle}
      </Typography>
      <TabbedShowLayout sx={{ paddingBottom: '4px' }}>
        <TabbedShowLayout.Tab label='Items' icon={<ICON_ITEM />}>
          <ItemList
            storeKey={`${constants.R_BATCHES}-${id}-items-list`}
            empty={false}
            filter={{ batch: id }}
            actions={<ItemActions preferenceKey={preferenceKey} />}
            bulkActionButtons={<BulkActions preferenceKey={preferenceKey} />}
            preferenceKey={preferenceKey}
            disableSyncWithLocation
          />
        </TabbedShowLayout.Tab>
        <TabbedShowLayout.Tab label='Details' icon={<ICON_DETAILS />}>
          <BatchForm isShow />
        </TabbedShowLayout.Tab>
      </TabbedShowLayout>
    </Show>
  )
}
