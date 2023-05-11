import React from 'react'
import {
  CreateButton,
  EditButton,
  Show,
  TabbedShowLayout,
  TopToolbar,
  FilterButton,
  SelectColumnsButton,
  DateField
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
import { Typography } from '@mui/material'

const ShowActions = (): React.ReactElement => {
  return (
    <>
      <TopToolbar>
        <TopToolbarField source='batchNumber' />
        <EditButton />
      </TopToolbar>
    </>
  )
}

const ItemActions = (): React.ReactElement => {
  const { id = '' } = useParams()
  const batchId: string = id

  return (
    <TopToolbar>
      <CreateButton label='ADD ITEM' to={`/items/create?batch=${batchId}`} />
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

export default function BatchShow(): React.ReactElement {
  const { id } = useParams()
  const pageTitle = 'View Batch'
  return (
    <Show actions={<ShowActions />}>
      <Typography variant='h5' fontWeight='bold' sx={{ padding: '15px' }}>
        <constants.ICON_BATCH /> {pageTitle}
      </Typography>
      <TabbedShowLayout>
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
          <FlexBox>
            <StyledFieldWithLabel label='Project Code' source='projectCode' />
            <StyledFieldWithLabel label='Created' source='createdAt' />
          </FlexBox>
        </TabbedShowLayout.Tab>
        <TabbedShowLayout.Tab label='Items' icon={<ICON_ITEM />}>
          <ItemList
            empty={false}
            filter={{ batchId: id }}
            actions={<ItemActions />}
            storeKey='batch-items-list'
            disableSyncWithLocation
          />
        </TabbedShowLayout.Tab>
      </TabbedShowLayout>
    </Show>
  )
}
