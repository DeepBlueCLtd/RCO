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
      <CreateButton to={'create'} />
    </TopToolbar>
  )

  const showActive = (name: string) =>
    name === 'department' ||
    name === 'organisation' ||
    name === 'protectiveMarkingAuthority'

  return (
    <List actions={<ListActions />} resource={cName}>
      <Datagrid
        rowClick={(id: Identifier) => {
          const cID: string = id.toString()
          return `/${cName}/${cID}`
        }}>
        <FunctionField
          style={{ cursor: 'pointer' }}
          render={({ name }: any) => `${name as string}`}
          label='Name'
        />
        {showActive(name) ? <BooleanField source='active' /> : ''}
      </Datagrid>
    </List>
  )
}
