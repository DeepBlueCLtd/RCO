import React from 'react'
import {
  BooleanField,
  CreateButton,
  Datagrid,
  type Identifier,
  List,
  TextField,
  TopToolbar
} from 'react-admin'

interface Props {
  name: string
}

export default function UserList(props: Props): React.ReactElement {
  const { name } = props
  const cName: string = name
  const basePath: string = `/${cName}`

  const ListActions = (): React.ReactElement => {
    return (
      <TopToolbar>
        <CreateButton to={`${basePath}/create`} />
      </TopToolbar>
    )
  }

  return (
    <List actions={<ListActions />} perPage={25} resource={cName}>
      <Datagrid
        rowClick={(id: Identifier) => {
          const cID: string = id.toString()
          return `${basePath}/${cID}`
        }}
        bulkActionButtons={false}>
        <TextField source='name' />
        <BooleanField source='adminRights' label='Admin Rights' />
        <BooleanField source='active' label='Active User' />
      </Datagrid>
    </List>
  )
}
