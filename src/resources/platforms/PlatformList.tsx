import { Chip, Typography } from '@mui/material'
import React, { useEffect } from 'react'
import {
  BooleanField,
  CreateButton,
  Datagrid,
  List,
  TextField,
  TopToolbar,
  FilterButton,
  useListContext,
  FunctionField,
  SearchInput,
  useRedirect
} from 'react-admin'
import useCanAccess from '../../hooks/useCanAccess'
import * as constants from '../../constants'
import HistoryButton from '../../components/HistoryButton'

interface Props {
  name: string
}

interface ActiveFilterType {
  label: string
  source: string
  val?: boolean | string
}

export const ActiveFilter = ({
  label,
  source,
  val = true
}: ActiveFilterType): React.ReactElement => {
  const { setFilters, displayedFilters, filterValues } = useListContext()
  useEffect(() => {
    setFilters({ ...filterValues, [source]: val }, displayedFilters)
  }, [])
  return <Chip sx={{ marginBottom: 1 }} label={label} />
}

const filters = [
  <SearchInput source='q' key='q' alwaysOn />,
  <ActiveFilter source='active' key='platform' label='Active Platforms' />
]

export default function PlatformList(props: Props): React.ReactElement {
  const { name } = props
  const cName: string = name
  const basePath: string = `/${cName}`
  const { hasAccess } = useCanAccess()
  const redirect = useRedirect()

  const ListActions = (): React.ReactElement => (
    <TopToolbar>
      {hasAccess(constants.R_PLATFORMS, { write: true }) ? (
        <CreateButton to={`${basePath}/create`} />
      ) : null}
      <FilterButton />
    </TopToolbar>
  )

  return (
    <List
      actions={<ListActions />}
      perPage={25}
      filters={filters}
      resource='platform'>
      <Typography variant='h5' fontWeight={'bold'} style={{ padding: ' 15px' }}>
        Platforms
      </Typography>
      <Datagrid rowClick='show' bulkActionButtons={false}>
        <TextField<Platform> source='id' label='ID' />
        <TextField<Platform> source='name' />
        <BooleanField<Platform>
          source='active'
          label='Active Platform'
          looseValue
        />
        <FunctionField<Platform>
          label='History'
          render={(record) => {
            return (
              <HistoryButton
                onClick={(e) => {
                  e.stopPropagation()
                  redirect(
                    `/audit?filter=${JSON.stringify({
                      dataId: record.id,
                      resource: cName
                    })}`
                  )
                }}
              />
            )
          }}
        />
      </Datagrid>
    </List>
  )
}
