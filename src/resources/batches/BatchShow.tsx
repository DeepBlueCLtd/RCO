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
  useDataProvider
, downloadCSV } from 'react-admin'
import SourceField from '../../components/SourceField'
import { useParams } from 'react-router-dom'
import * as constants from '../../constants'
import ItemList from '../items/ItemList'
import { Button, Modal } from '@mui/material'
import ChangeLocation from '../items/ItemForm/ChangeLocation'
import FlexBox from '../../components/FlexBox'
import { Download } from '@mui/icons-material'

const ShowActions = () => {
  const dataProvider = useDataProvider()
  const { id = '' } = useParams()
  const batchId: string = id

  const exportReport = async () => {
    const csvContent: string[] = []

    const { data: batch } = await dataProvider.getOne<Batch>(
      constants.R_BATCHES,
      { id: batchId }
    )

    const { data: project } = await dataProvider.getOne<ReferenceItem>(
      constants.R_PROJECTS,
      { id: batch.project }
    )

    const { data: platform } = await dataProvider.getOne<ReferenceItem>(
      constants.R_PLATFORMS,
      { id: batch.platform }
    )

    const { data: items } = await dataProvider.getList<Item>(
      constants.R_ITEMS,
      {
        sort: { field: 'id', order: 'ASC' },
        filter: { batchId: batch.id },
        pagination: { page: 1, perPage: 1000 }
      }
    )

    const { data: vaultLocations } = await dataProvider.getMany<ReferenceItem>(
      constants.R_VAULT_LOCATION,
      {
        ids: items.map((item: Item) => item.vaultLocation) 
      }
    )

    const vaultLocationById: Record<number, ReferenceItem> = {}

    vaultLocations.forEach((location: ReferenceItem) => {
      vaultLocationById[location.id] = location
    })

    const { batchNumber, createdAt } = batch

    const batchHeader: string[] = [
      'Batch Number',
      'Created At',
      'Project Name',
      'platform Name'
    ]

    const batchValues: string[] = [
      batchNumber,
      createdAt,
      project.name,
      platform.name
    ]

    csvContent.push(batchHeader.join(','))
    csvContent.push(batchValues.join(','))

    const itemHeader: string[] = ['Item Number', 'Media Type', 'Vault Location']

    // add empty line
    csvContent.push(['', '', '', ''].join(','))

    csvContent.push(itemHeader.join(','))

    items.forEach((item: Item) => {
      const { item_number: itemNumber, mediaType, vaultLocation } = item
      const location: ReferenceItem = vaultLocationById[vaultLocation]
      const row: string[] = [itemNumber, mediaType, location.name]
      csvContent.push(row.join(','))
    })

    const result = csvContent.join('\n')

    downloadCSV(result, batch.name)
  }

  const handleClick = () => {
    exportReport().catch(console.log)
  }

  return (
    <TopToolbar>
      <Button
        startIcon={<Download />}
        sx={{ lineHeight: '1.5' }}
        size='small'
        onClick={handleClick}>
        Muster list
      </Button>
      <CreateButton label='Create item' to={`/items/create?batch=${batchId}`} />
      <EditButton />
      <DeleteWithConfirmButton />
    </TopToolbar>
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

const textFieldStyle = {
  display: 'flex',
  alignItems: 'center',
  height: '49px',
  width: '224px',
  font: 'inherit',
  color: 'rgba(0, 0, 0, 0.38)',
  background: 'rgba(0, 0, 0, 0.12)',
  borderRadius: '4px',
  padding: '16px',
  margin: '16px'
}

export default function BatchShow(): React.ReactElement {
  const { id } = useParams()
  return (
    <Show actions={<ShowActions />}>
      <TextField source='batchNumber' sx={textFieldStyle} />
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
