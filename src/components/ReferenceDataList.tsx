import React from 'react'
import {
  CreateButton,
  Datagrid,
  FunctionField,
  type Identifier,
  List,
  TopToolbar,
  BooleanField,
  TextField,
  FilterButton,
  SearchInput,
  useRedirect
} from 'react-admin'
import useCanAccess from '../hooks/useCanAccess'
import * as constants from '../constants'
import HistoryButton from './HistoryButton'
import { ActiveFilter } from '../resources/platforms/PlatformList'

interface PropType {
  name: string
}

const getFilters = (cName: string): React.ReactElement[] => {
  const filters = [<ActiveFilter source='active' key='active' label='Active' />]
  if (cName === constants.R_MEDIA_TYPE) {
    filters.push(<SearchInput source='q' key='q' alwaysOn />)
  }
  return filters
}

export default function ReferenceDataList({
  name
}: PropType): React.ReactElement {
  const cName: string = name
  const redirect = useRedirect()

  const { hasAccess } = useCanAccess()

  const ListActions = (): React.ReactElement => (
    <TopToolbar>
      {hasAccess('reference-data', { write: true }) ? (
        <CreateButton to={'create'} />
      ) : null}
      <FilterButton />
    </TopToolbar>
  )

  const notShowActive = (name: string): boolean => name === constants.R_AUDIT

  return (
    <List
      actions={<ListActions />}
      resource={cName}
      filters={getFilters(cName)}>
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
        {name === constants.R_MEDIA_TYPE ? (
          <TextField source='itemSize' />
        ) : null}
        {notShowActive(name) ? '' : <BooleanField source='active' looseValue />}
        <FunctionField<IntegerReferenceItem>
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
