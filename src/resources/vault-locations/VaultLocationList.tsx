import React, { useMemo, useState } from 'react'
import { FunctionField, List } from 'react-admin'
import FlexBox from '../../components/FlexBox'
import VaultLocationReport from '../../components/VaultLocationReport'
import * as constants from '../../constants'
import { Button, IconButton } from '@mui/material'
import { Article, History } from '@mui/icons-material'
import ResourceHistoryModal from '../../components/ResourceHistory'
import DblClickDatagridConfigurable from '../../components/DblClickDatagridConfigurable'

export default function VaultLocationList(): React.ReactElement {
  const [open, setOpen] = useState<boolean>()
  const [openMusterList, setOpenMusterList] = useState(false)
  const [record, setRecord] = useState<ReferenceItem>()

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
      <DblClickDatagridConfigurable
        resource={constants.R_VAULT_LOCATION}
        bulkActionButtons={<BulkActions />}>
        <FunctionField
          style={{ cursor: 'pointer' }}
          render={({ name }: any) => `${name as string}`}
          label='Name'
        />
        <FunctionField
          label='History'
          render={(record: ReferenceItem) => {
            return (
              <IconButton
                onClick={(e) => {
                  e.stopPropagation()
                  setRecord(record)
                  setOpen(true)
                }}>
                <History />
              </IconButton>
            )
          }}
        />
      </DblClickDatagridConfigurable>
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
