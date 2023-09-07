import React, { useMemo, useState } from 'react'
import {
  CreateButton,
  Datagrid,
  FunctionField,
  type Identifier,
  List,
  TopToolbar,
  BooleanField,
  TextField
} from 'react-admin'
import useCanAccess from '../hooks/useCanAccess'
import ResourceHistoryModal from './ResourceHistory'
import * as constants from '../constants'
import HistoryButton from './HistoryButton'

interface PropType {
  name: string
}

export default function ReferenceDataList({
  name
}: PropType): React.ReactElement {
  const cName: string = name
  const [open, setOpen] = useState<boolean>()
  const [record, setRecord] = useState<IntegerReferenceItem>()

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

  const notShowActive = (name: string): boolean => name === constants.R_AUDIT

  return (
    <List actions={<ListActions />} resource={cName}>
      <Datagrid
        bulkActionButtons={false}
        rowClick={(id: Identifier) => {
          const cID: string = id.toString()
          return `/${cName}/${cID}/show`
        }}>
        <TextField source='id' label='ID' />
        <FunctionField<IntegerReferenceItem>
          style={{ cursor: 'pointer' }}
          render={({ name }) => `${name}`}
          label='Name'
        />
        {notShowActive(name) ? '' : <BooleanField source='active' looseValue />}
        <FunctionField<IntegerReferenceItem>
          label='History'
          render={(record) => {
            return (
              <HistoryButton
                onClick={(e) => {
                  e.stopPropagation()
                  setRecord(record)
                  handleOpen(true)
                }}
              />
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
