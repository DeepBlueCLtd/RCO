import {
  Datagrid,
  DateField,
  FunctionField,
  List,
  TextField
} from 'react-admin'
import SourceField from '../../components/SourceField'
import * as constants from '../../constants'
import { IconButton } from '@mui/material'
import { History } from '@mui/icons-material'
import ResourceHistoryModal from '../../components/ResourceHistory'
import { useMemo, useState } from 'react'

export default function DestructionList(): React.ReactElement {
  const [open, setOpen] = useState<boolean>()
  const [record, setRecord] = useState<Destruction>()

  const filter = useMemo(
    () =>
      record?.id !== undefined
        ? { dataId: record.id, resource: constants.R_DESTRUCTION }
        : undefined,
    [record]
  )

  const handleOpen = (open: boolean): void => {
    setOpen(open)
  }
  return (
    <List>
      <Datagrid rowClick='show' bulkActionButtons={false}>
        <TextField source='reference' />
        <DateField source='createdAt' />
        <SourceField source='createdBy' reference={constants.R_USERS} />
        <DateField source='finalisedAt' />
        <SourceField source='finalisedBy' reference={constants.R_USERS} />
        <FunctionField
          label='History'
          render={(record: Destruction) => {
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
