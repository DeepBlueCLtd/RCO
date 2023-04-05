import React from 'react'
import { List, TextField, TopToolbar, Datagrid } from 'react-admin'

const ListActions = () => <TopToolbar></TopToolbar>

export default function ProtectiveMarkingAuthorityList(): React.ReactElement {
  return (
    <List actions={<ListActions />}>
      <Datagrid rowClick='show'>
        <TextField source='name' />
      </Datagrid>
    </List>
  )
}
