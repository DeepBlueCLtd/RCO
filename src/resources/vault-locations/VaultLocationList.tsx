import React, { useMemo, useState } from 'react'
import {
  Datagrid,
  FunctionField,
  type Identifier,
  List,
  useListContext
} from 'react-admin'
import FlexBox from '../../components/FlexBox'
import VaultLocationReport from '../../components/VaultLocationReport'
import useCanAccess from '../../hooks/useCanAccess'
import * as constants from '../../constants'
import { Button, IconButton } from '@mui/material'
import { Article, History } from '@mui/icons-material'
import ResourceHistoryModal from '../../components/ResourceHistory'
import useDoubleClick from '../../hooks/useDoubleClick'

export default function VaultLocationList(): React.ReactElement {
  return (
    <List>
      <DataList />
    </List>
  )
}

const DataList = (): React.ReactElement => {
  const { hasAccess } = useCanAccess()
  const [open, setOpen] = useState<boolean>()
  const [openMusterList, setOpenMusterList] = useState(false)
  const [record, setRecord] = useState<ReferenceItem>()
  const { selectedIds } = useListContext()
  const handleRowClick = useDoubleClick(constants.R_VAULT_LOCATION)

  const hasWriteAccess = hasAccess(constants.R_VAULT_LOCATION, {
    write: true
  })
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
    <>
      <Datagrid
        rowClick={
          hasWriteAccess
            ? (id: Identifier) => handleRowClick(id as number)
            : undefined
        }
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
      </Datagrid>
      <ResourceHistoryModal
        filter={filter}
        open={open}
        close={() => {
          setOpen(false)
        }}
      />
      <VaultLocationReport
        open={openMusterList}
        handleOpen={handleOpen}
        selectedIds={selectedIds}
      />
    </>
  )
}
