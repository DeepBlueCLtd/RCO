import {
  Datagrid,
  DateField,
  FunctionField,
  List,
  TextField
} from 'react-admin'
import SourceField from '../../components/SourceField'
import * as constants from '../../constants'
import ResourceHistoryModal from '../../components/ResourceHistory'
import { useMemo, useState } from 'react'
import HistoryButton from '../../components/HistoryButton'
import NullUndefinedFilter from '../../components/NullUndefinedFilter'

const filters = [
  <NullUndefinedFilter
    label='Destroyed'
    source='finalisedAt_neq'
    key='destroyed'
  />,
  <NullUndefinedFilter
    label='Not Destroyed'
    source='finalisedAt_eq'
    key='not_destroyed'
  />
]

export default function DestructionList(): React.ReactElement {
  const [open, setOpen] = useState<boolean>(false)
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
    <List filters={filters}>
      <Datagrid rowClick='show' bulkActionButtons={false}>
        <TextField<Destruction> source='name' label='Reference' />
        <DateField<Destruction> source='createdAt' />
        <SourceField<Destruction>
          source='createdBy'
          reference={constants.R_USERS}
        />
        <DateField<Destruction> source='finalisedAt' />
        <SourceField<Destruction>
          source='finalisedBy'
          reference={constants.R_USERS}
        />
        <FunctionField<Destruction>
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
        <TextField<Destruction> source='remarks' />
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
