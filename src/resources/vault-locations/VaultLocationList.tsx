import React from 'react'
import { Datagrid, FunctionField, List } from 'react-admin'

export default function VaultLocationList(): React.ReactElement {
  return (
    <List>
      <Datagrid rowClick='edit'>
        <FunctionField
          style={{ cursor: 'pointer' }}
          render={({ name }: any) => `${name as string}`}
          label='Name'
        />
      </Datagrid>
    </List>
  )
}
