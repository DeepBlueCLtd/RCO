import { Chip } from '@mui/material'
import React, { useEffect } from 'react'
import {
  BooleanField,
  BulkDeleteButton,
  CreateButton,
  Datagrid,
  type Identifier,
  List,
  TextField,
  TopToolbar,
  FilterButton,
  useListContext
} from 'react-admin'

interface Props {
  name: string
}

export default function PlatformList(props: Props): React.ReactElement {
  const { name } = props
  const cName: string = name
  const basePath: string = `/reference-data/${cName}`
  const ListActions = (): React.ReactElement => (
    <TopToolbar>
      <CreateButton to={`${basePath}/create`} />
      <FilterButton />
    </TopToolbar>
  )

  interface ActiveFilterType {
    label: string
    source: string
  }

  const ActiveFilter = ({ label, source }: ActiveFilterType) => {
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
    <List actions={<ListActions />} perPage={25} filters={filters}>
      <Datagrid
        rowClick={(id: Identifier) => {
          const cID: string = id.toString()
          return `${basePath}/${cID}`
        }}
        bulkActionButtons={<BulkDeleteButton mutationMode='pessimistic' />}>
        <TextField source='name' />
        <BooleanField source='active' label='Active Platform' />
      </Datagrid>
    </List>
  )
}
