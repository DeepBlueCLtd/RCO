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
  ReferenceArrayField,
  SingleFieldList,
  ChipField
} from 'react-admin'
import { useParams } from 'react-router-dom'
import * as constants from '../../constants'
import { ICON_ITEM, ICON_DETAILS } from '../../constants'
import ItemList from '../items/ItemList'
import FlexBox from '../../components/FlexBox'
import FieldWithLabel, {
  type FieldWithLabelProps
} from '../../components/FieldWithLabel'
import TopToolbarField from '../../components/TopToolbarField'
import { ItemAssetReport } from '../items/ItemsReport'
import { IconButton, Typography } from '@mui/material'
import useCanAccess from '../../hooks/useCanAccess'
import ResourceHistoryModal from '../../components/ResourceHistory'
import { History } from '@mui/icons-material'
import { Box } from '@mui/system'

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
        <CreateButton label='ADD ITEM' to={`/items/create?batch=${batchId}`} />
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

function StyledFieldWithLabel(props: FieldWithLabelProps): React.ReactElement {
  return (
    <FieldWithLabel
      labelPosition='top'
      separator=''
      labelStyles={{ minWidth: '300px' }}
      {...props}
    />
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

const ReferenceArrayFieldWithLabel = (): React.ReactElement => (
  <Box>
    <Typography fontWeight='bold' sx={{ minWidth: '300px' }}>
      Cat Cave
    </Typography>
    <ReferenceArrayField source='catCave' reference={constants.R_CAT_CAVE}>
      <SingleFieldList>
        <ChipField source='name' />
      </SingleFieldList>
    </ReferenceArrayField>
  </Box>
)

export default function BatchShow(): React.ReactElement {
  const { id } = useParams()
  const pageTitle = 'View Batch'
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
          <FlexBox>
            <StyledFieldWithLabel label='Id' source='id' />
            <StyledFieldWithLabel
              label='User name'
              source='createdBy'
              reference={constants.R_USERS}
            />
            <StyledFieldWithLabel label='Batch Number' source='batchNumber' />
          </FlexBox>
          <FlexBox>
            <StyledFieldWithLabel
              label='Year of Receipt'
              source='yearOfReceipt'
            />
            <StyledFieldWithLabel
              label='Project'
              source='project'
              reference={constants.R_PROJECTS}
            />
          </FlexBox>
          <FlexBox>
            <StyledFieldWithLabel
              source='platform'
              label='Platform'
              reference={constants.R_PLATFORMS}
            />
            <StyledFieldWithLabel
              source='organisation'
              label='Organisation'
              reference='organisation'
            />
          </FlexBox>
          <FlexBox>
            <StyledFieldWithLabel
              label='Department'
              source='department'
              reference='department'
            />
            <StyledFieldWithLabel
              label='Maximum Protective Marking'
              source='maximumProtectiveMarking'
              reference='protectiveMarking'
            />
          </FlexBox>
          <FlexBox>
            <StyledFieldWithLabel label='Remarks' source='remarks' />
            <StyledFieldWithLabel label='Receipt notes' source='receiptNotes' />
          </FlexBox>
          <FlexBox>
            <StyledFieldWithLabel
              component={DateField}
              label='Start Date'
              source='startDate'
            />
            <StyledFieldWithLabel
              component={DateField}
              label='End Date'
              source='endDate'
            />
          </FlexBox>
          <FlexBox alignItems='flex-start'>
            <StyledFieldWithLabel
              label='Cat Code'
              source='catCode'
              reference={constants.R_CAT_CODE}
            />
            <StyledFieldWithLabel
              label='Cat Handling'
              source='catHandling'
              reference={constants.R_CAT_HANDLING}
            />
          </FlexBox>
          <FlexBox alignItems='flex-start'>
            <StyledFieldWithLabel label='Created' source='createdAt' />
            <ReferenceArrayFieldWithLabel />
          </FlexBox>
        </TabbedShowLayout.Tab>
        <TabbedShowLayout.Tab label='Items' icon={<ICON_ITEM />}>
          <ItemList
            storeKey={`${constants.R_BATCHES}-${id}-items-list`}
            empty={false}
            filter={{ batchId: id }}
            actions={<ItemActions />}
            disableSyncWithLocation
          />
        </TabbedShowLayout.Tab>
      </TabbedShowLayout>
      <HistoryModal handleOpen={handleOpen} open={open} />
    </Show>
  )
}
