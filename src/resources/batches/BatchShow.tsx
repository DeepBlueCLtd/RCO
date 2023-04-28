import React from 'react'
import {
  CreateButton,
  EditButton,
  Show,
  TabbedShowLayout,
  TopToolbar,
  FilterButton,
  SelectColumnsButton,
  DeleteButton
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

const ShowActions = () => {
  return (
    <>
      <TopToolbar>
        <TopToolbarField source='batchNumber' />
        <EditButton />
        <DeleteButton mutationMode='pessimistic' />
      </TopToolbar>
    </>
  )
}

const ItemActions = () => {
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

function StyledFieldWithLabel(props: FieldWithLabelProps) {
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
  return (
    <Show actions={<ShowActions />}>
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
