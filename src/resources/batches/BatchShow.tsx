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
  TextField,
  Form
} from 'react-admin'
import { useParams } from 'react-router-dom'
import * as constants from '../../constants'
import { ICON_ITEM, ICON_DETAILS } from '../../constants'
import ItemList from '../items/ItemList'
import FlexBox from '../../components/FlexBox'
import TopToolbarField from '../../components/TopToolbarField'
import { ItemAssetReport } from '../items/ItemsReport'
import { IconButton, Typography } from '@mui/material'
import useCanAccess from '../../hooks/useCanAccess'
import ResourceHistoryModal from '../../components/ResourceHistory'
import { History } from '@mui/icons-material'
import { Box } from '@mui/system'
import { useConfigData } from '../../utils/useConfigData'
import SourceField from '../../components/SourceField'
import { ValueField } from '../projects/ProjectShow'
import ProtectionBlockInputs from '../../components/ProtectionBlockInputs'

export interface ShowActionProps {
  handleOpen: (open: boolean) => void
}

const Created = (): React.ReactElement => {
  const sx = {
    width: '100%'
  }
  return (
    <Box
      component='fieldset'
      style={{
        width: '100%',
        padding: '0 15px',
        borderRadius: 16,
        margin: '20px 0'
      }}>
      <legend>
        <Typography variant='h5' align='center' sx={{ fontWeight: '600' }}>
          Created
        </Typography>
      </legend>
      <FlexBox sx={{ padding: '10px 0' }}>
        <ValueField label='Created at' sx={sx}>
          <DateField source='createdAt' />
        </ValueField>
        <ValueField label='Created by' sx={sx}>
          <SourceField source='createdBy' reference={constants.R_USERS} />
        </ValueField>
      </FlexBox>
    </Box>
  )
}

const Remarks = (): React.ReactElement => {
  const sx = {
    width: '100%'
  }
  return (
    <Box
      component='fieldset'
      style={{
        width: '100%',
        padding: '0 15px',
        borderRadius: 16,
        margin: '20px 0'
      }}>
      <legend>
        <Typography variant='h5' align='center' sx={{ fontWeight: '600' }}>
          Remarks
        </Typography>
      </legend>
      <FlexBox sx={{ padding: '10px 0' }}>
        <ValueField label='Remarks' sx={sx}>
          <TextField source='remarks' />
        </ValueField>
        <ValueField label='Receipt notes' sx={sx}>
          <TextField source='receiptNotes' />
        </ValueField>
      </FlexBox>
    </Box>
  )
}

const Details = (): React.ReactElement => {
  const configData = useConfigData()

  const sx = { width: '100%' }
  return (
    <Box
      component='fieldset'
      style={{
        width: '100%',
        padding: '0 15px',
        borderRadius: 16,
        margin: '20px 0'
      }}>
      <legend>
        <Typography variant='h5' align='center' sx={{ fontWeight: '600' }}>
          Details
        </Typography>
      </legend>
      <FlexBox sx={{ padding: '10px 0' }}>
        <ValueField label={configData?.projectName ?? 'Project'} sx={sx}>
          <SourceField source='project' reference={constants.R_PROJECTS} />
        </ValueField>
        <ValueField label='Platform' sx={sx}>
          <SourceField source='platform' reference={constants.R_PLATFORMS} />
        </ValueField>
        <ValueField label='Start' sx={sx}>
          <DateField source='startDate' />
        </ValueField>
        <ValueField label='End' sx={sx}>
          <DateField source='endDate' />
        </ValueField>
      </FlexBox>
    </Box>
  )
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
          <Details />
          <Form>
            <ProtectionBlockInputs
              disabled={true}
              markingSource='protectiveMarking'
            />
          </Form>
          <Remarks />
          <Created />
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
      rowClick='show'
      omit={props?.omit}
      preferenceKey={props.preferenceKey}
      {...props}>
      <TextField source='item_number' label='Reference' />
      <TextField source='mediaType' label='Media type' />
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
