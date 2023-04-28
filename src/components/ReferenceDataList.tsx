import React from 'react'
import {
  CreateButton,
  Datagrid,
  FunctionField,
  type Identifier,
  List,
  TopToolbar,
  BooleanField
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
        rowClick={(id: Identifier) => {
          const cID: string = id.toString()
          return `/reference-data/${cName}/${cID}`
        }}>
        <FunctionField
          style={{ cursor: 'pointer' }}
          render={({ name }: any) => `${name as string}`}
          label='Name'
        />
        {name === 'department' ? <BooleanField source='active' /> : ''}
      </Datagrid>
    </List>
  )
}
