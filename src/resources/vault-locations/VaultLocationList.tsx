import React, { useMemo, useState } from 'react'
import { Datagrid, FunctionField, List } from 'react-admin'
import FlexBox from '../../components/FlexBox'
import VaultLocationReport from '../../components/VaultLocationReport'
import useCanAccess from '../../hooks/useCanAccess'
import * as constants from '../../constants'
import { IconButton } from '@mui/material'
import { History } from '@mui/icons-material'
import ResourceHistoryModal from '../../components/ResourceHistory'

export default function VaultLocationList(): React.ReactElement {
  const { hasAccess } = useCanAccess()
  const [open, setOpen] = useState<boolean>()
  const [record, setRecord] = useState<ReferenceItem>()
  const hasWriteAccess = hasAccess(constants.R_VAULT_LOCATION, { write: true })
  const filter = useMemo(
    () =>
      record?.id !== undefined
        ? { dataId: record.id, resource: constants.R_VAULT_LOCATION }
        : undefined,
    [record]
  )

  const handleOpen = (open: boolean): void => {
    setOpen(open)
  }

  const BulkActions = (): React.ReactElement => {
    return (
      <>
        <FlexBox>
          <VaultLocationReport />
        </FlexBox>
      </>
    )
  }

  return (
    <List>
      <Datagrid
        rowClick={hasWriteAccess ? 'edit' : undefined}
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
                  handleOpen(true)
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
          handleOpen(false)
        }}
      />
    </List>
  )
}
