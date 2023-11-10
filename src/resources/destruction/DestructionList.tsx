import {
  Datagrid,
  FunctionField,
  List,
  SearchInput,
  TextField
} from 'react-admin'
import SourceField from '../../components/SourceField'
import * as constants from '../../constants'
import ResourceHistoryModal from '../../components/ResourceHistory'
import { useMemo, useState } from 'react'
import HistoryButton from '../../components/HistoryButton'
import NullUndefinedFilter from '../../components/NullUndefinedFilter'
import { ConditionalDateField } from '../dispatch/DispatchList'

const filters = [
  <SearchInput source='q' key='q' alwaysOn />,
  <NullUndefinedFilter
    label='Destroyed'
    source={process.env.MOCK ? 'finalisedAt_neq' : 'finalisedAt__notnull'}
    key='destroyed'
  />,
  <NullUndefinedFilter
    label='Not Destroyed'
    source={process.env.MOCK ? 'finalisedAt_eq' : 'finalisedAt__null'}
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
    <List
      filters={filters}
      filterDefaultValues={
        process.env.MOCK
          ? { finalisedAt_eq: true }
          : { finalisedAt__null: true }
      }>
      <Datagrid rowClick='show' bulkActionButtons={false}>
        <TextField<Destruction> source='name' label='Reference' />
        <ConditionalDateField<Destruction>
          label='Finalised at'
          source='finalisedAt'
          resource={constants.R_DESTRUCTION}
        />
        <SourceField<Destruction>
          source='createdBy'
          reference={constants.R_USERS}
        />
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
