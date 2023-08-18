import React, { useMemo, useState } from 'react'
import { BooleanField, FunctionField, List, TextField } from 'react-admin'
import FlexBox from '../../components/FlexBox'
import VaultLocationReport from '../../components/VaultLocationReport'
import * as constants from '../../constants'
import { Button } from '@mui/material'
import { Article } from '@mui/icons-material'
import ResourceHistoryModal from '../../components/ResourceHistory'
import DatagridConfigurableWithShow from '../../components/DatagridConfigurableWithShow'
import HistoryButton from '../../components/HistoryButton'

export default function VaultLocationList(): React.ReactElement {
  const [open, setOpen] = useState<boolean>()
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
    <List>
      <DatagridConfigurableWithShow
        resource={constants.R_VAULT_LOCATION}
        bulkActionButtons={<BulkActions />}>
        <TextField source='id' label='ID' />
        <FunctionField
          style={{ cursor: 'pointer' }}
          render={({ name }: any) => `${name as string}`}
          label='Name'
        />
        <BooleanField
          source='active'
          label='Active Vault Location'
          looseValue
        />
        <FunctionField
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
