import React, { useMemo, useState } from 'react'
import {
  CreateButton,
  Datagrid,
  FunctionField,
  type Identifier,
  List,
  TopToolbar,
  BooleanField
} from 'react-admin'
import useCanAccess from '../hooks/useCanAccess'
import { IconButton } from '@mui/material'
import { History } from '@mui/icons-material'
import ResourceHistoryModal from './ResourceHistory'

interface PropType {
  name: string
}

export default function ReferenceDataList({
  name
}: PropType): React.ReactElement {
  const cName: string = name
  const [open, setOpen] = useState<boolean>()
  const [record, setRecord] = useState<ActiveReferenceItem>()

  const { hasAccess } = useCanAccess()

  const ListActions = (): React.ReactElement => (
    <TopToolbar>
      {hasAccess('reference-data', { write: true }) ? (
        <CreateButton to={'create'} />
      ) : null}
    </TopToolbar>
  )

  const filter = useMemo(
    () =>
      record?.id !== undefined
        ? { dataId: record.id, resource: cName }
        : undefined,
    [record]
  )

  const handleOpen = (open: boolean): void => {
    setOpen(open)
  }

  const notShowActive = (name: string): boolean => name === 'audit'

  return (
    <List actions={<ListActions />} resource={cName}>
      <Datagrid
        bulkActionButtons={false}
        rowClick={(id: Identifier) => {
          const cID: string = id.toString()
          return `/${cName}/${cID}/show`
        }}>
        <FunctionField
          style={{ cursor: 'pointer' }}
          render={({ name }: any) => `${name as string}`}
          label='Name'
        />
        {notShowActive(name) ? '' : <BooleanField source='active' />}
        <FunctionField
          label='History'
          render={(record: ActiveReferenceItem) => {
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
