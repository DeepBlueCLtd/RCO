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
import useCanAccess from '../hooks/useCanAccess'

interface PropType {
  name: string
}

export default function ReferenceDataList({
  name
}: PropType): React.ReactElement {
  const cName: string = name

  const { hasAccess } = useCanAccess()

  const ListActions = (): React.ReactElement => (
    <TopToolbar>
      {hasAccess('reference-data', { write: true }) ? (
        <CreateButton to={'create'} />
      ) : null}
    </TopToolbar>
  )

  const notShowActive = (name: string): boolean => name === 'audit'

  return (
    <List actions={<ListActions />} resource={cName}>
      <Datagrid
        bulkActionButtons={false}
        rowClick={(id: Identifier) => {
          const cID: string = id.toString()
          return `/${cName}/${cID}`
        }}>
        <FunctionField
          style={{ cursor: 'pointer' }}
          render={({ name }: any) => `${name as string}`}
          label='Name'
        />
        {notShowActive(name) ? '' : <BooleanField source='active' />}
      </Datagrid>
    </List>
  )
}
