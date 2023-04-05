import React from 'react'
import {
  CreateButton,
  Datagrid,
  FunctionField,
  type Identifier,
  List,
  TopToolbar
} from 'react-admin'

interface PropType {
  name: string
}

export default function ReferenceDataList({
  name
}: PropType): React.ReactElement {
  const cName: string = name
  const ListActions = () => (
    <TopToolbar>
      <CreateButton to={`/reference-data/${cName}/create`} />
    </TopToolbar>
  )
  return (
    <List actions={<ListActions />}>
      <Datagrid
        rowClick={(id: Identifier) => `/reference-data/${cName}/${id}/show`}>
        <FunctionField
          style={{ cursor: 'pointer' }}
          render={({ name }: any) => `${name as string}`}
          label='Name'
        />
      </Datagrid>
    </List>
  )
}
