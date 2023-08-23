import { Chip } from '@mui/material'
import React, { useEffect, useMemo, useState } from 'react'
import {
  BooleanField,
  CreateButton,
  Datagrid,
  List,
  TextField,
  TopToolbar,
  FilterButton,
  useListContext,
  FunctionField
} from 'react-admin'
import useCanAccess from '../../hooks/useCanAccess'
import * as constants from '../../constants'
import ResourceHistoryModal from '../../components/ResourceHistory'
import HistoryButton from '../../components/HistoryButton'

interface Props {
  name: string
}

export default function PlatformList(props: Props): React.ReactElement {
  const { name } = props
  const cName: string = name
  const basePath: string = `/${cName}`
  const { hasAccess } = useCanAccess()
  const [open, setOpen] = useState<boolean>(false)
  const [record, setRecord] = useState<IntegerReferenceItem>()

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
  const ListActions = (): React.ReactElement => (
    <TopToolbar>
      {hasAccess(constants.R_PLATFORMS, { write: true }) ? (
        <CreateButton to={`${basePath}/create`} />
      ) : null}
      <FilterButton />
    </TopToolbar>
  )

  interface ActiveFilterType {
    label: string
    source: string
  }

  const ActiveFilter = ({
    label,
    source
  }: ActiveFilterType): React.ReactElement => {
    const { setFilters, displayedFilters, filterValues } = useListContext()
    useEffect(() => {
      setFilters({ ...filterValues, [source]: true }, displayedFilters)
    }, [])
    return <Chip sx={{ marginBottom: 1 }} label={label} />
  }

  const filters = [
    <ActiveFilter source='active' key='platform' label='Active Platforms' />
  ]

  return (
    <List
      actions={<ListActions />}
      perPage={25}
      filters={filters}
      resource='platform'>
      <Datagrid rowClick='show' bulkActionButtons={false}>
        <TextField source='id' label='ID' />
        <TextField source='name' />
        <BooleanField source='active' label='Active Platform' looseValue />
        <FunctionField
          label='History'
          render={(record: IntegerReferenceItem) => {
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
