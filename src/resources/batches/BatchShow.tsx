import React, { useState } from 'react'
import {
  BulkDeleteButton,
  CreateButton,
  EditButton,
  Show,
  TabbedShowLayout,
  TopToolbar,
  useListContext,
  useRefresh,
  FilterButton,
  SelectColumnsButton,
  DeleteButton
} from 'react-admin'
import { useParams } from 'react-router-dom'
import * as constants from '../../constants'
import ItemList from '../items/ItemList'
import { Button, Modal } from '@mui/material'
import ChangeLocation from '../items/ItemForm/ChangeLocation'
import FlexBox from '../../components/FlexBox'
import { Download } from '@mui/icons-material'
import BatchReport from './BatchReport'
import Printable from '../../components/Printable'
import FieldWithLabel, {
  type FieldWithLabelProps
} from '../../components/FieldWithLabel'
import TopToolbarField from '../../components/TopToolbarField'

const ShowActions = () => {
  const [open, setOpen] = useState(false)

  const { id = '' } = useParams()
  const batchId: string = id

  const handleClose = () => {
    setOpen(false)
  }

  const handleOpen = () => {
    setOpen(true)
  }

  return (
    <>
      <TopToolbar>
        <TopToolbarField source='batchNumber' />
        <Button
          startIcon={<Download />}
          sx={{ lineHeight: '1.5' }}
          size='small'
          onClick={handleOpen}>
          Muster list
        </Button>
        <EditButton />
        <DeleteButton mutationMode='pessimistic' />
      </TopToolbar>
      <Printable open={open} onClose={handleClose}>
        <BatchReport batchId={batchId} />
      </Printable>
    </>
  )
}

const BulkActions = () => {
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

const ItemActions = () => {
  const { id = '' } = useParams()
  const batchId: string = id

  return (
    <TopToolbar>
      <CreateButton label='ADD ITEM' to={`/items/create?batch=${batchId}`} />
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
        <TabbedShowLayout.Tab label='Details'>
          <FlexBox>
            <StyledFieldWithLabel label='Id' source='id' />
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
              label='Protective Marking Authority'
              source='protectiveMarkingAuthority'
              reference='protectiveMarkingAuthority'
            />
          </FlexBox>
          <FlexBox>
            <StyledFieldWithLabel
              label='Maximum Protective Marking'
              source='maximumProtectiveMarking'
              reference='protectiveMarking'
            />
            <StyledFieldWithLabel label='Remarks' source='remarks' />
          </FlexBox>
          <FlexBox>
            <StyledFieldWithLabel label='Receipt notes' source='receiptNotes' />
          </FlexBox>
        </TabbedShowLayout.Tab>
        <TabbedShowLayout.Tab label='Items'>
          <ItemList
            filter={{ batchId: id }}
            bulkActionButtons={<BulkActions />}
            actions={<ItemActions />}
          />
        </TabbedShowLayout.Tab>
      </TabbedShowLayout>
    </Show>
  )
}
