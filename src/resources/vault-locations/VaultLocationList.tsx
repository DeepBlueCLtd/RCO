import React, { useMemo, useState } from 'react'
import {
  BooleanField,
  FilterButton,
  FunctionField,
  List,
  TextField,
  TopToolbar
} from 'react-admin'
import FlexBox from '../../components/FlexBox'
import VaultLocationReport from '../../components/VaultLocationReport'
import * as constants from '../../constants'
import { Button } from '@mui/material'
import { Article } from '@mui/icons-material'
import ResourceHistoryModal from '../../components/ResourceHistory'
import DatagridConfigurableWithShow from '../../components/DatagridConfigurableWithShow'
import HistoryButton from '../../components/HistoryButton'
import { ActiveFilter } from '../platforms/PlatformList'

const filters = [<ActiveFilter source='active' key='active' label='Active' />]

const ListActions = (): React.ReactElement => (
  <TopToolbar>
    <FilterButton />
  </TopToolbar>
)

export default function VaultLocationList(): React.ReactElement {
  const [open, setOpen] = useState<boolean>(false)
  const [openMusterList, setOpenMusterList] = useState(false)
  const [record, setRecord] = useState<IntegerReferenceItem>()

  const filter = useMemo(
    () =>
      record?.id !== undefined
        ? { dataId: record.id, resource: constants.R_VAULT_LOCATION }
        : undefined,
    [record]
  )

  const handleOpen = (open: boolean) => () => {
    setOpenMusterList(open)
  }

  const BulkActions = (): React.ReactElement => {
    return (
      <>
        <FlexBox>
          <Button
            startIcon={<Article />}
            sx={{ lineHeight: '1.5' }}
            size='small'
            onClick={handleOpen(true)}>
            Location Muster List
          </Button>
        </FlexBox>
      </>
    )
  }
  return (
    <List
      actions={<ListActions />}
      filters={filters}
      filterDefaultValues={{ active: true }}>
      <DatagridConfigurableWithShow
        resource={constants.R_VAULT_LOCATION}
        bulkActionButtons={<BulkActions />}>
        <TextField<VaultLocation> source='id' label='ID' />
        <FunctionField<VaultLocation>
          style={{ cursor: 'pointer' }}
          render={({ name }: any) => `${name as string}`}
          label='Name'
        />
        <BooleanField<VaultLocation>
          source='active'
          label='Active Vault Location'
          looseValue
        />
        <FunctionField<VaultLocation>
          label='History'
          render={(record: IntegerReferenceItem) => {
            return (
              <HistoryButton
                onClick={(e) => {
                  e.stopPropagation()
                  setRecord(record)
                  setOpen(true)
                }}
              />
            )
          }}
        />
      </DatagridConfigurableWithShow>
      <ResourceHistoryModal
        filter={filter}
        open={open}
        close={() => {
          setOpen(false)
        }}
      />
      <VaultLocationReport open={openMusterList} handleOpen={handleOpen} />
    </List>
  )
}
