import React from 'react'
import { Datagrid, FunctionField, List } from 'react-admin'

export default function ReferenceDataList(): React.ReactElement {
  return (
    <List>
      <Datagrid>
        <FunctionField
          render={({ name }: any) => `${name as string}`}
          label='Name'
        />
      </Datagrid>
    </List>
  )
}
