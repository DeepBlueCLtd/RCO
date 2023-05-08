import React from 'react'
import {
  BooleanField,
  CreateButton,
  Datagrid,
  EditButton,
  type Identifier,
  List,
  TextField,
  TopToolbar,
  useRecordContext
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

  const CustomEditButton = (): React.ReactElement => {
    const record = useRecordContext(props)
    const id: string = record.id.toString()
    return <EditButton to={`${basePath}/${id}`} />
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
        <CustomEditButton />
      </Datagrid>
    </List>
  )
}
