import React, { useState } from 'react'
import {
  BulkDeleteButton,
  CreateButton,
  DeleteWithConfirmButton,
  EditButton,
  Show,
  TabbedShowLayout,
  TopToolbar,
  TextField,
  useListContext,
  useRefresh,
  FilterButton,
  SelectColumnsButton
} from 'react-admin'
import SourceField from '../../components/SourceField'
import { useParams } from 'react-router-dom'
import * as constants from '../../constants'
import ItemList from '../items/ItemList'
import { Button, Modal, type Theme } from '@mui/material'
import ChangeLocation from '../items/ItemForm/ChangeLocation'
import FlexBox from '../../components/FlexBox'
import { Download } from '@mui/icons-material'
import BatchReport from './BatchReport'
import Printable from '../../components/Printable'

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
        <Show
          sx={{ marginRight: 'auto' }}
          actions={false}
          resource={constants.R_BATCHES}>
          <TextField
            source='batchNumber'
            sx={(theme: Theme) => ({
              width: '150px',
              fontWeight: 'bold',
              height: '35px',
              display: 'flex',
              alignItems: 'center',
              padding: '16px',
              background: theme.palette.primary.main,
              justifyContent: 'center',
              color: theme.palette.common.white
            })}
          />
        </Show>
        <Button
          startIcon={<Download />}
          sx={{ lineHeight: '1.5' }}
          size='small'
          onClick={handleOpen}>
          Muster list
        </Button>
        <EditButton />
        <DeleteWithConfirmButton />
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
        <BulkDeleteButton />
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
            actions={<ItemActions />}
          />
        </TabbedShowLayout.Tab>
      </TabbedShowLayout>
    </Show>
  )
}
