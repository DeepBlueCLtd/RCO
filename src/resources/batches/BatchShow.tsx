import React, { useState } from 'react'
import {
  BulkDeleteButton,
  CreateButton,
  DeleteWithConfirmButton,
  EditButton,
  Show,
  TabbedShowLayout,
  TextField,
  TopToolbar
} from 'react-admin'
import SourceField from '../../components/SourceField'
import { useParams } from 'react-router-dom'
import * as constants from '../../constants'
import ItemList from '../items/ItemList'
import { Button, Modal } from '@mui/material'
import ChangeLocation from '../items/ItemForm/ChangeLocation'
import FlexBox from '../../components/FlexBox'

const ShowActions = () => {
  const { id = '' } = useParams()
  const batchId: string = id
  return (
    <TopToolbar>
      <CreateButton label='Create item' to={`/items/create?batch=${batchId}`} />
      <EditButton />
      <DeleteWithConfirmButton />
    </TopToolbar>
  )
}

const BulkActions = ({ selectedIds }: any) => {
  const [open, setOpen] = useState(false)

  const handleClose = () => {
    setOpen(false)
  }

  return (
    <>
      <FlexBox>
        <BulkDeleteButton />
        <Button
          size='small'
          variant='outlined'
          onClick={() => { setOpen((value) => !value) }}>
          Change Location
        </Button>
      </FlexBox>
      <Modal open={open} onClose={handleClose}>
        <ChangeLocation
          successCallback={handleClose}
          onCancel={handleClose}
          ids={selectedIds}
        />
      </Modal>
    </>
  )
}

export default function BatchShow(): React.ReactElement {
  const { id } = useParams()
  return (
    <Show actions={<ShowActions />}>
      <TabbedShowLayout>
        <TabbedShowLayout.Tab label='Details'>
          <TextField source='id' />
          <TextField source='batchNumber' />
          <TextField source='yearOfReceipt' />
          <SourceField source='project' reference={constants.R_PROJECTS} />
          <SourceField source='platform' reference={constants.R_PLATFORMS} />
          <SourceField source='organisation' reference='organisation' />
          <SourceField source='department' reference='department' />
          <SourceField
            source='protectiveMarkingAuthority'
            reference='protectiveMarkingAuthority'
          />
          <SourceField
            source='maximumProtectiveMarking'
            reference='protectiveMarking'
          />
          <TextField source='remarks' />
        </TabbedShowLayout.Tab>
        <TabbedShowLayout.Tab label='Items'>
          <ItemList
            filter={{ batchId: id }}
            bulkActionButtons={<BulkActions />}
          />
        </TabbedShowLayout.Tab>
      </TabbedShowLayout>
    </Show>
  )
}
