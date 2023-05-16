import { Chip } from '@mui/material'
import React, { useEffect } from 'react'
import {
  BooleanField,
  CreateButton,
  Datagrid,
  type Identifier,
  List,
  TextField,
  TopToolbar,
  FilterButton,
  useListContext
} from 'react-admin'
import useCanAccess from '../../hooks/useCanAccess'
import * as constants from '../../constants'

interface Props {
  name: string
}

export default function PlatformList(props: Props): React.ReactElement {
  const { name } = props
  const cName: string = name
  const basePath: string = `/${cName}`
  const { hasAccess } = useCanAccess()
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
      resource='platforms'>
      <Datagrid
        rowClick={(id: Identifier) => {
          const cID: string = id.toString()
          return `${basePath}/${cID}`
        }}
        bulkActionButtons={false}>
        <TextField source='name' />
        <BooleanField source='active' label='Active Platform' />
      </Datagrid>
    </List>
  )
}
